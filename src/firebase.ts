import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc,
  getDocFromServer,
  query,
  orderBy
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";
import { FinanceLead } from "./types";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

let db: any = null;
let isFirebaseActive = false;

// Auto-detect if firebaseConfig is valid and not a placeholder
const isPlaceholder = !firebaseConfig || firebaseConfig.projectId.includes("placeholder") || firebaseConfig.apiKey.includes("placeholder");

if (!isPlaceholder) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isFirebaseActive = true;
    console.log("Firebase initialized successfully with config:", firebaseConfig.projectId);

    // Test connection dynamically (non-blocking)
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.warn("Please check your Firebase configuration: Client appears offline.");
        }
      }
    };
    testConnection();
  } catch (e) {
    console.error("Firebase SDK init failed. Falling back to local storage.", e);
    isFirebaseActive = false;
  }
} else {
  console.log("Using local sandbox database (Firebase config is currently placeholder).");
}

// Local storage backup values for premium mockup database
const LOCAL_LEADS_KEY = "tata_finance_leads_v1";

const getLocalLeads = (): FinanceLead[] => {
  const data = localStorage.getItem(LOCAL_LEADS_KEY);
  if (!data) {
    // Return mock initial leads for premium presentation if list is completely empty
    const initialLeads: FinanceLead[] = [
      {
        id: "mock-1",
        customerName: "Rahul Sharma",
        mobile: "9689811509",
        vehicle: "HARRIER",
        variant: "Fearless Plus Dark Edition",
        emi: 24500,
        downPayment: 200000,
        status: "Approved",
        followupDate: "2026-06-01",
        createdAt: new Date(Date.now() - 3 * 86450000).toISOString()
      },
      {
        id: "mock-2",
        customerName: "Pooja Deshmukh",
        mobile: "9876543210",
        vehicle: "SAFARI",
        variant: "Accomplished+ (A) Dual Tone",
        emi: 31200,
        downPayment: 350000,
        status: "Documents Pending",
        followupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        createdAt: new Date(Date.now() - 1 * 86450000).toISOString()
      },
      {
        id: "mock-3",
        customerName: "Kishor Patil",
        mobile: "9123456789",
        vehicle: "CURVV",
        variant: "Creative + AMT",
        emi: 18500,
        downPayment: 150000,
        status: "Bank Processing",
        followupDate: new Date(Date.now()).toISOString().split('T')[0],
        createdAt: new Date(Date.now()).toISOString()
      }
    ];
    localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(initialLeads));
    return initialLeads;
  }
  return JSON.parse(data);
};

const setLocalLeads = (leads: FinanceLead[]) => {
  localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(leads));
};

export const getFirestoreActiveState = () => isFirebaseActive;

export async function getFinanceLeads(): Promise<FinanceLead[]> {
  if (!isFirebaseActive) {
    return getLocalLeads().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const path = "financeLeads";
  try {
    const q = query(collection(db, path));
    const querySnapshot = await getDocs(q);
    const leads: FinanceLead[] = [];
    querySnapshot.forEach((docSnap) => {
      leads.push({
        id: docSnap.id,
        ...docSnap.data()
      } as FinanceLead);
    });
    return leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    if (error instanceof Error && error.message.includes("permission")) {
      handleFirestoreError(error, OperationType.GET, path);
    }
    // Gracious fallback to local storage on firebase read issues
    return getLocalLeads();
  }
}

export async function addFinanceLead(lead: Omit<FinanceLead, "id">): Promise<FinanceLead> {
  const path = "financeLeads";
  if (!isFirebaseActive) {
    const leads = getLocalLeads();
    const newId = "lead-" + Math.random().toString(36).substr(2, 9);
    const newLead: FinanceLead = { id: newId, ...lead };
    leads.push(newLead);
    setLocalLeads(leads);
    return newLead;
  }

  try {
    const docRef = await addDoc(collection(db, path), lead);
    return {
      id: docRef.id,
      ...lead
    };
  } catch (error) {
    console.warn("Firestore save failed, falling back to local fallback:", error);
    const leads = getLocalLeads();
    const newId = "lead-" + Math.random().toString(36).substr(2, 9);
    const newLead: FinanceLead = { id: newId, ...lead };
    leads.push(newLead);
    setLocalLeads(leads);
    return newLead;
  }
}

export async function updateFinanceLead(id: string, updatedFields: Partial<FinanceLead>): Promise<void> {
  if (!isFirebaseActive || id.startsWith("mock-") || id.startsWith("lead-")) {
    const leads = getLocalLeads();
    const index = leads.findIndex((l) => l.id === id);
    if (index !== -1) {
      leads[index] = { ...leads[index], ...updatedFields };
      setLocalLeads(leads);
    }
    return;
  }

  const path = `financeLeads/${id}`;
  try {
    const docRef = doc(db, "financeLeads", id);
    await updateDoc(docRef, updatedFields as any);
  } catch (error) {
    console.warn("Firestore update failed, editing local index:", error);
    const leads = getLocalLeads();
    const index = leads.findIndex((l) => l.id === id);
    if (index !== -1) {
      leads[index] = { ...leads[index], ...updatedFields };
      setLocalLeads(leads);
    }
  }
}

export async function deleteFinanceLead(id: string): Promise<void> {
  if (!isFirebaseActive || id.startsWith("mock-") || id.startsWith("lead-")) {
    const leads = getLocalLeads();
    const updated = leads.filter((l) => l.id !== id);
    setLocalLeads(updated);
    return;
  }

  const path = `financeLeads/${id}`;
  try {
    await deleteDoc(doc(db, "financeLeads", id));
  } catch (error) {
    console.warn("Firestore delete failed, deleting from local array:", error);
    const leads = getLocalLeads();
    const updated = leads.filter((l) => l.id !== id);
    setLocalLeads(updated);
  }
}
