//
//  GomFried_MVC_to_MVVM_30min_UITestsLaunchTests.swift
//  GomFried-MVC-to-MVVM(30min)UITests
//
//  Created by 허태양 on 2022/09/03.
//

import XCTest

class GomFried_MVC_to_MVVM_30min_UITestsLaunchTests: XCTestCase {

    override class var runsForEachTargetApplicationUIConfiguration: Bool {
        true
    }

    override func setUpWithError() throws {
        continueAfterFailure = false
    }

    func testLaunch() throws {
        let app = XCUIApplication()
        app.launch()

        // Insert steps here to perform after app launch but before taking a screenshot,
        // such as logging into a test account or navigating somewhere in the app

        let attachment = XCTAttachment(screenshot: app.screenshot())
        attachment.name = "Launch Screen"
        attachment.lifetime = .keepAlways
        add(attachment)
    }
}
