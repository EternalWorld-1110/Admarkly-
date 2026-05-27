package com.admarkly.app

import android.Manifest
import android.annotation.SuppressLint
import android.app.DownloadManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.view.View
import android.webkit.*
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import com.admarkly.app.databinding.ActivityMainBinding
import java.io.File
import java.text.SimpleDateFormat
import java.util.*

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private var fileUploadCallback: ValueCallback<Array<Uri>>? = null
    private var cameraTempPhotoUri: Uri? = null
    private val webViewUrl by lazy { getString(R.string.website_url) }

    // Launcher for file chooser
    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == RESULT_OK) {
            val dataIntent = result.data
            var results: Array<Uri>? = null

            // If there's no data, checked if camera returned a capture
            if (dataIntent == null || dataIntent.data == null) {
                cameraTempPhotoUri?.let { uri ->
                    results = arrayOf(uri)
                }
            } else {
                val dataString = dataIntent.dataString
                if (dataString != null) {
                    results = arrayOf(Uri.parse(dataString))
                }
            }
            fileUploadCallback?.onReceiveValue(results)
        } else {
            fileUploadCallback?.onReceiveValue(null)
        }
        fileUploadCallback = null
    }

    // Camera permission launcher
    private val cameraPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            openFileChooserWithCamera()
        } else {
            Toast.makeText(this, "Camera permission is required to capture photos for quotes.", Toast.LENGTH_SHORT).show()
            fileUploadCallback?.onReceiveValue(null)
            fileUploadCallback = null
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupWebView()
        setupSwipeToRefresh()
        setupBottomNavigation()
        monitorInternetConnectivity()

        binding.btnRetry.setOnClickListener {
            if (isNetworkConnected()) {
                showOnline()
                binding.webView.reload()
            } else {
                Toast.makeText(this, "Still disconnected. Check your network.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val webView = binding.webView
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            cacheMode = WebSettings.LOAD_DEFAULT
            mediaPlaybackRequiresUserGesture = false
            useWideViewPort = true
            loadWithOverviewMode = true
            builtInZoomControls = false
            displayZoomControls = false
        }

        // Custom WebViewClient
        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: android.graphics.Bitmap?) {
                super.onPageStarted(view, url, favicon)
                binding.loadingLayout.visibility = View.VISIBLE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                binding.loadingLayout.visibility = View.GONE
                binding.swipeRefresh.isRefreshing = false
                webView.visibility = View.VISIBLE
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                // If main web load failed, triggers offline prompt
                if (request?.isForMainFrame == true) {
                    showOffline()
                }
            }

            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    // Stay inside app if targeting our site, else open launcher
                    if (url.contains("ais-") || url.contains("admarkly") || url.contains("vercel")) {
                        return false
                    }
                    // Open browser for ext links
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                    startActivity(intent)
                    return true
                } else if (url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("whatsapp:") || url.startsWith("wa.me")) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        startActivity(intent)
                        return true
                    } catch (e: Exception) {
                        Toast.makeText(this@MainActivity, "Application to handle link not found.", Toast.LENGTH_SHORT).show()
                        return true
                    }
                }
                return false
            }
        }

        // WebChromeClient to enable camera, uploading quotes specs
        webView.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileUploadCallback?.onReceiveValue(null)
                fileUploadCallback = filePathCallback

                // Check Camera Permission
                if (ContextCompat.checkSelfPermission(this@MainActivity, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                    cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
                } else {
                    openFileChooserWithCamera()
                }
                return true
            }
        }

        // Setup PDF Quote download helper
        webView.setDownloadListener { url, userAgent, contentDisposition, mimetype, contentLength ->
            try {
                val request = DownloadManager.Request(Uri.parse(url)).apply {
                    setMimeType(mimetype)
                    addRequestHeader("User-Agent", userAgent)
                    setDescription("Downloading Premium Quotation sheet...")
                    setTitle(URLUtil.guessFileName(url, contentDisposition, mimetype))
                    allowScanningByMediaScanner()
                    setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                    setDestinationInPublicDir(Environment.DIRECTORY_DOWNLOADS, URLUtil.guessFileName(url, contentDisposition, mimetype))
                }
                val dm = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
                dm.enqueue(request)
                Toast.makeText(this, "Download initiated...", Toast.LENGTH_SHORT).show()
            } catch (e: Exception) {
                // Fallback direct web tab download
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                startActivity(intent)
            }
        }

        webView.loadUrl(webViewUrl)
    }

    private fun setupSwipeToRefresh() {
        binding.swipeRefresh.setColorSchemeResources(R.color.brand_accent)
        binding.swipeRefresh.setProgressBackgroundColorSchemeResource(R.color.brand_surface)
        binding.swipeRefresh.setOnRefreshListener {
            if (isNetworkConnected()) {
                binding.webView.reload()
            } else {
                binding.swipeRefresh.isRefreshing = false
                showOffline()
            }
        }
    }

    private fun setupBottomNavigation() {
        binding.bottomNavigation.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> {
                    if (isNetworkConnected()) {
                        binding.webView.loadUrl(webViewUrl)
                    }
                    true
                }
                R.id.nav_voice -> {
                    // Triggers the web application's voice assistant action instantly via JS!
                    binding.webView.evaluateJavascript("javascript:document.getElementById('voice-trigger-btn')?.click();", null)
                    Toast.makeText(this, "Opening AI Assistant voice trigger...", Toast.LENGTH_SHORT).show()
                    true
                }
                R.id.nav_downloads -> {
                    // Launches direct native Downloads folder view for stored quotes
                    try {
                        val intent = Intent(DownloadManager.ACTION_VIEW_DOWNLOADS)
                        startActivity(intent)
                    } catch (e: Exception) {
                        Toast.makeText(this, "Opening default system files viewer...", Toast.LENGTH_SHORT).show()
                    }
                    true
                }
                R.id.nav_share -> {
                    val shareIntent = Intent(Intent.ACTION_SEND).apply {
                        type = "text/plain"
                        putExtra(Intent.EXTRA_SUBJECT, "Share Admarkly Car Quotes app")
                        putExtra(Intent.EXTRA_TEXT, "Configure professional car quotes on my custom app! Access web dashboard: $webViewUrl")
                    }
                    startActivity(Intent.createChooser(shareIntent, "Share App Via"))
                    true
                }
                else -> false
            }
        }
    }

    private fun openFileChooserWithCamera() {
        val photoFile = File(
            getExternalFilesDir(Environment.DIRECTORY_PICTURES),
            "IMG_" + SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(Date()) + ".jpg"
        )
        cameraTempPhotoUri = FileProvider.getUriForFile(this, "com.admarkly.app.fileprovider", photoFile)

        val cameraIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE).apply {
            putExtra(MediaStore.EXTRA_OUTPUT, cameraTempPhotoUri)
        }

        val selectionIntent = Intent(Intent.ACTION_GET_CONTENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "*/*"
        }

        val chooserIntent = Intent.createChooser(selectionIntent, "Select quote attachment sources").apply {
            putExtra(Intent.EXTRA_INITIAL_INTENTS, arrayOf(cameraIntent))
        }

        fileChooserLauncher.launch(chooserIntent)
    }

    // Monitor internet state dynamically with ConnectivityManager Callback
    private fun monitorInternetConnectivity() {
        val connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val builder = NetworkRequest.Builder()
        connectivityManager.registerNetworkCallback(builder.build(), object : ConnectivityManager.NetworkCallback() {
            override fun onAvailable(network: Network) {
                super.onAvailable(network)
                runOnUiThread {
                    showOnline()
                }
            }

            override fun onLost(network: Network) {
                super.onLost(network)
                runOnUiThread {
                    showOffline()
                }
            }
        })

        // Initial check on boot
        if (!isNetworkConnected()) {
            showOffline()
        } else {
            showOnline()
        }
    }

    private fun isNetworkConnected(): Boolean {
        val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = cm.activeNetwork ?: return false
        val activeNetwork = cm.getNetworkCapabilities(network) ?: return false
        return activeNetwork.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ||
                activeNetwork.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) ||
                activeNetwork.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)
    }

    private fun showOffline() {
        binding.offlineLayout.visibility = View.VISIBLE
        binding.webView.visibility = View.INVISIBLE
        binding.loadingLayout.visibility = View.GONE
        
        binding.connectionBadge.setBackgroundResource(R.drawable.bg_badge_offline)
        binding.badgeDot.setBackgroundResource(R.drawable.bg_dot_offline)
        binding.badgeText.text = "Offline"
    }

    private fun showOnline() {
        binding.offlineLayout.visibility = View.GONE
        binding.connectionBadge.setBackgroundResource(R.drawable.bg_badge)
        binding.badgeDot.setBackgroundResource(R.drawable.bg_dot_online)
        binding.badgeText.text = "Online"
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (binding.webView.canGoBack()) {
            binding.webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
