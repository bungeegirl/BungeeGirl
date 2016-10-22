#import "RCTFBSDKGraphRequestManager.h"
#import "RCTFBSDKGraphRequestConnectionContainer.h"


@implementation RCTFBSDKGraphRequestManager

RCT_EXPORT_MODULE(FBGraphRequest);

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

#pragma mark - React Native Methods

RCT_REMAP_METHOD(start, startWithBatch:(NSArray *)requestBatch
                 timeout:(nonnull NSNumber *)timeout
                 batchCallback:(RCTResponseSenderBlock)callback)
{
  RCTFBSDKGraphRequestConnectionContainer *connection =
  [[RCTFBSDKGraphRequestConnectionContainer alloc] initWithRequestBatch:requestBatch
                                                                timeout:timeout
                                                          batchCallback:callback];
  [connection start];
}

@end
