/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
#import <Instabug/Instabug.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <RCTOneSignal.h>

@import Batch;

@implementation AppDelegate
@synthesize oneSignal = _oneSignal;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
	
  
#ifdef DEBUG
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
#else
    jsCodeLocation = [CodePush bundleURL];
		//instabug
		[Instabug startWithToken:@"2b24356f56a8bc6e24ef2895bf7f3ea5" invocationEvent:IBGInvocationEventShake];
#endif
	
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"FlipTrip"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

	// Start Batch
	//  [Batch startWithAPIKey:@"DEV578EC1727F9EEACE8AA2F865374"];
	[Batch startWithAPIKey:@"578EC1727C200A73BE71A173171ECF"];
	
	// register for push
	[BatchPush registerForRemoteNotifications];
	
	// onesignal

	self.oneSignal = [[RCTOneSignal alloc] initWithLaunchOptions:launchOptions
																												 appId:@"ee39b3fd-581b-4c8c-bf57-548f625b3ded"
																											settings:@{kOSSettingsKeyInFocusDisplayOption : @(OSNotificationDisplayTypeNone), kOSSettingsKeyAutoPrompt : @YES}];

	
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
	
	return [[FBSDKApplicationDelegate sharedInstance] application:application
																	didFinishLaunchingWithOptions:launchOptions];
}

// Facebook SDK
- (void)applicationDidBecomeActive:(UIApplication *)application {
	[FBSDKAppEvents activateApp];
}


- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
	return [[FBSDKApplicationDelegate sharedInstance] application:application
																												openURL:url
																							sourceApplication:sourceApplication
																										 annotation:annotation];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification {
	[RCTOneSignal didReceiveRemoteNotification:notification];
}

@end
