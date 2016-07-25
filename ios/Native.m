//
//
//  native.m
//  yolo
//
//  Created by Soheil Yasrebi on 4/1/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "RCTBridge.h"
#import "RCTBridgeModule.h"
#import "RCTEventDispatcher.h"

@import CoreLocation;
@import Batch;


@interface Native : NSObject <RCTBridgeModule>
@end

@implementation Native

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();


RCT_EXPORT_METHOD(locationFromLatitude:(CLLocationDegrees) latitude longitude:(CLLocationDegrees)longitude)
{
  CLLocation *loc = [[CLLocation alloc] initWithLatitude:latitude longitude:longitude];
  CLGeocoder *reverseGeocoder = [[CLGeocoder alloc] init];
  [reverseGeocoder reverseGeocodeLocation:loc completionHandler:^(NSArray *placemarks, NSError *error)
   {
     if (error){
       return;
     }
     
     CLPlacemark *myPlacemark = [placemarks objectAtIndex:0];
     NSString *countryCode = myPlacemark.ISOcountryCode;
     NSString *countryName = myPlacemark.country;
     NSString *cityName = [myPlacemark.addressDictionary objectForKey:@"City"];
     
     [self.bridge.eventDispatcher sendDeviceEventWithName:@"LocationInfo"
                                                     body:@{@"countryCode": countryCode,
                                                            @"countryName": countryName,
                                                            @"cityName": cityName}];
     
     
   }];
}

RCT_EXPORT_METHOD(setBatchId:(NSString*) batchId)
{
  BatchUserDataEditor *editor = [BatchUser editor];
  [editor setIdentifier:batchId]; // Set to `nil` if you want to remove the identifier.
  [editor save];
}

@end