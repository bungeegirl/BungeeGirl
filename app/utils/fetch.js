import _ from 'lodash'

import {
  API_URL
} from './constants'

export default (path, options={}) => {
  _.defaults(options, {
    method: 'GET'
  })
  _.merge(options, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return fetch(`${API_URL}${path}`, options)
}
