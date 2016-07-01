'use strict'
import * as TSheets from 'tsheets-sdk'
import { keys } from 'lodash'
export function index (req, res) {
  // const { start_date, end_date} = req.body
  doUntilCompletion({ resource: 'timesheets', method: 'get', params: { modified_since: '2016-06-28T15:19:21+00:00' } })
    .then((results) => {
      console.log('do until completion results:', results)
      res.json(results)
    })
    .catch((error) => {
      console.log('error with do until completion:', error)
      res.status(error.code || 500).json(error)
    })

}
let callCount = 0
function doUntilCompletion ({ resource, method, params, results }) {
	console.log('do until complete', { resource, method, params, results })
	if (!params.page) params.page = 0
  params.page++
	callCount++
	console.log(`\n\ncallcount: ${callCount}\n\n`)
	console.log('TSheets', TSheets.timesheets)
	if (callCount >= 5) {
		console.log('it was called more than would be good', callCount)
		return results
	}
  return TSheets[resource][method](params)
    .then((res) => {
      if (!res.more || !res.results || !res.results[resource]) {
        console.log('-------- noooooo moreeeeee', results)
        return results
      }
      if (!results) results = Object.assign({}, res.results[resource])
      results = Object.assign({}, results, res.results[resource])
      return doUntilCompletion({resource, method, params, results})
    })
    .catch((error) => {
      console.error('error gettting resource:', error)
      return Promise.reject(error)
    })
}


function crawlFromToNow () {

}
