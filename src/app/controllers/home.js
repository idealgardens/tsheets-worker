import * as TSheets from 'tsheets-sdk'
import { getFirebase } from '../utils/firebase'

export function index (req, res) {
  // const { start_date, end_date} = req.body
  callUntilLastPage({ resource: 'timesheets', method: 'get', params: { modified_since: '2016-06-29T15:19:21+00:00', per_page: 2 } })
    .then((results) => {
      console.log('do until completion results:', results)
			getFirebase().ref('tsheets/timesheets').update(results).then(fireRes => {
				console.log('Firebase Response:', fireRes)
				res.json(results)
			}).catch(error => {
				console.log('error setting ref:', error)
				res.status(500).json(error)
			})
    })
    .catch((error) => {
      console.log('error with do until completion:', error)
      res.status(error.code || 500).json(error)
    })
}

let pageCount = 0
const allowedCallCount = 3
// Calls TSheets API mutiple times in a row until
function callUntilLastPage ({ resource, method, params, results }) {
	if (!params.page) params.page = 0
  params.page++
	pageCount++
	console.log(`\n\ncallcount: ${pageCount}\n\n`)
	if (pageCount >= allowedCallCount) {
		console.log('page count limit was reached', pageCount)
		return results
	}
  return TSheets[resource][method](params)
    .then((res) => {
      if (!res.more || !res.results || !res.results[resource]) {
        console.log('-------- noooooo moreeeeee', results)
        return results
      }
      results = Object.assign({}, results || {}, res.results[resource])
      return callUntilLastPage({resource, method, params, results})
    })
    .catch((error) => {
      console.error('error gettting resource:', error)
      return Promise.reject(error)
    })
}


function crawlFromToNow () {

}
