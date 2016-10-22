//
//  RCTFBSDKGraphRequestConnectionContainer.h
//  Bungee
//
//  Created by Ari Litan on 10/15/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <RCTBridgeModule.h>

#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <Foundation/Foundation.h>

@interface RCTFBSDKGraphRequestConnectionContainer : NSObject<FBSDKGraphRequestConnectionDelegate>

/*!
 @abstract  Initialize the RCTFBSDKGraphRequestConnectionContainer object.
 @param requestBatch  The batch of requests to be sent
 @param timeout   The timeout interval to wait for a response before giving up
 @param callback  The connection callback to be invoked when the connection is completed.
 This callback will carry the responses of requests back to javascript.
 */
- (instancetype)initWithRequestBatch:(NSArray *)requestBatch
                             timeout:(NSInteger)timeout
                       batchCallback:(RCTResponseSenderBlock)callback;

/*!
 @abstract  Send the batch of requests via a FBSDKGraphRequestConnection.
 */
- (void)start;

@end
