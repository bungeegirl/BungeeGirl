/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  ActivityIndicatorIOS,
  CameraRoll,
  Image,
  ListView,
  Platform,
  StyleSheet,
  View,
} = ReactNative;

var groupByEveryN = require('groupByEveryN');
var logError = require('logError');
import _ from 'underscore'
var FBSDK = require('react-native-fbsdk');
const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

var propTypes = {
  /**
   * The group where the photos will be fetched from. Possible
   * values are 'Album', 'All', 'Event', 'Faces', 'Library', 'PhotoStream'
   * and SavedPhotos.
   */
  /**
   * Number of images that will be fetched in one page.
   */
  batchSize: React.PropTypes.number,

  /**
   * A function that takes a single image as a parameter and renders it.
   */
  renderImage: React.PropTypes.func,

  /**
   * imagesPerRow: Number of images to be shown in each row.
   */
  imagesPerRow: React.PropTypes.number,

   /**
   * The asset type, one of 'Photos', 'Videos' or 'All'
   */
  assetType: React.PropTypes.oneOf([
    'Photos',
    'Videos',
    'All',
  ]),

};

var FacebookRollView = React.createClass({
  propTypes: propTypes,

  getDefaultProps: function(): Object {
    return {
      groupTypes: 'SavedPhotos',
      batchSize: 5,
      imagesPerRow: 4,
      assetType: 'Photos',
      renderImage: function(source) {
        var imageSize = 150;
        var imageStyle = [styles.image, {width: imageSize, height: imageSize}];
        return (
          <Image
            source={{uri: source}}
            style={imageStyle}
          />
        );
      },
    };
  },

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: this._rowHasChanged});

    return {
      assets: ([]: Array<Image>),
      allImages: [],
      groupTypes: this.props.groupTypes,
      lastCursor: (null : ?string),
      assetType: this.props.assetType,
      noMore: true,
      loadingMore: false,
      dataSource: ds,
    };
  },

  componentDidMount() {
    const fetchPhotos = this.props.albumId + '/photos?fields=images&limit=100'
    const infoRequest = new GraphRequest(
      fetchPhotos,
      null,
      this._responseInfoCallback,
    );
    new GraphRequestManager().addRequest(infoRequest).start()
  },

  _responseInfoCallback(error: ?Object, result: ?Object) {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      const results = _.map(result.data, (image) => {
        return _.first(image.images).source
      })
      this._appendAssets(results)
      if(result.paging && result.paging.next) {
        this.setState({loadingMore: true})
        const fetchPhotos = this.props.albumId + '/photos?fields=images&limit=10&after=' + result.paging.cursors.after
        const infoRequest = new GraphRequest(
          fetchPhotos,
          null,
          this._responseInfoCallback,
        );
        new GraphRequestManager().addRequest(infoRequest).start()
      }
    }
  },

  _appendAssets: function(images) {
    const allImages = _.union(this.state.allImages, images)
    var newState: Object = { loadingMore: false, allImages};

    if (images.length > 0) {
      newState.dataSource = this.state.dataSource.cloneWithRows(
        groupByEveryN(allImages, this.props.imagesPerRow)
      );
    }

    this.setState(newState);
  },

  render: function() {
    return (
      <ListView
        renderRow={this._renderRow}
        renderFooter={this._renderFooterSpinner}
        style={styles.container}
        dataSource={this.state.dataSource}
      />
    );
  },

  _rowHasChanged: function(r1: Array<Image>, r2: Array<Image>): boolean {
    if (r1.length !== r2.length) {
      return true;
    }

    for (var i = 0; i < r1.length; i++) {
      if (r1[i] !== r2[i]) {
        return true;
      }
    }

    return false;
  },

  _renderFooterSpinner: function() {
    if (this.state.loadingMore) {
      return <ActivityIndicatorIOS style={styles.spinner} />;
    }
    return null;
  },

  // rowData is an array of images
  _renderRow: function(rowData: Array<Image>, sectionID: string, rowID: string)  {
    var images = rowData.map((image, index) => {
      if (image === null) {
        return null;
      }
      var isFirst
      (sectionID == 's1' && rowID == '0' && index == 0) ? isFirst = true : isFirst = false
      return this.props.renderImage(image, isFirst, rowID, index);
    });

    return (
      <View style={styles.row}>
        {images}
      </View>
    );
  },
});

var styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  url: {
    fontSize: 9,
    marginBottom: 14,
  },
  image: {
    margin: 4,
  },
  info: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

module.exports = FacebookRollView;
