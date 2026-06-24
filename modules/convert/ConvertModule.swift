// @/modules/convert/ConvertModule.swift (pdfcraft-mobile)

import ExpoModulesCore
import WebKit

public class ConvertModule: Module {
	private var webView: WKWebView?
	public func definition() -> ModuleDefinition {
		Name("Convert")

		AsyncFunction("convert") { (
			docxPath: String, outputPath: String, promise: Promise
		) in
			DispatchQueue.main.async {
				let docxUrl = URL(fileURLWithPath: docxPath)
				let outputUrl = URL(fileURLWithPath: outputPath)

				self.webView = WKWebView()
				self.webView?.loadFileURL(
					docxUrl,
					allowingReadAccessTo:
						docxUrl.deletingLastPathComponent()
				)
				let delegate = NavigationDelegate(
					outputUrl: outputUrl,
					promise: promise
				)
				self.webView?.navigationDelegate = delegate
				objc_setAssociatedObject(self.webView!, "navDelegate", delegate, .OBJC_ASSOCIATION_RETAIN_NONATOMIC)
			}
		}
	}
}

class NavigationDelegate: NSObject, WKNavigationDelegate {
	let outputUrl: URL
	let promise: Promise
	
	init(outputUrl: URL, promise: Promise) {
		self.outputUrl = outputUrl
		self.promise = promise
	}
	
	func webView(
		_ webView: WKWebView,
		didFinish navigation: WKNavigation!
	) {
		if #available(iOS 14.5, *) {
			let config = WKPDFConfiguration()
			webView.createPDF(configuration: config) { result in
				switch result {
				case .success(let data):
					do {
						try data.write(to: self.outputUrl)
						self.promise.resolve(true)
					} catch {
						self.promise.reject(
							"E_WRITE_ERROR",
							"Failed to write PDF file"
						)
					}
				case .failure(let error):
					self.promise.reject(
						"E_CONVERT_ERROR",
						"PDF creation failed"
					)
				}
			}
		} else { self.promise.resolve(false) }
	}
	
	func webView(
		_ webView: WKWebView,
		didFail navigation: WKNavigation!,
		withError error: Error
	) {
		self.promise.reject(
			"E_LOAD_ERROR",
			"Failed to load DOCX in WebView"
		)
	}
}