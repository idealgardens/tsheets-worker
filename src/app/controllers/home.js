import * as TSheets from 'tsheets-sdk'
import { getFirebase } from '../utils/firebase'
const firebase = getFirebase()

const modified_since = '2016-06-20T15:19:21+00:00'
// const start_date = '2016-06-01'
// const end_date = '2016-06-01'
// const ids = [
// 	55033,
// 	42982
// ]
export function index (req, res) {
  // const { start_date, end_date} = req.body
	const resourceName = 'jobcodes'
  callUntilLastPage({ resource: resourceName, method: 'get', params: { modified_since } })
    .then((results) => {
      console.log('do until completion results:', results)
			firebase.ref(`tsheets/${resourceName}`).update(results)
				.then(() => res.json(results))
				.catch((error) => {
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
let endResults
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
			console.log('tsheets results:', res.results)
      if (!res.more || !res.results) {
        console.log('-------- noooooo moreeeeee', res.results[resource])
        return results || res.results[resource]
      }
      endResults = Object.assign({}, results || {}, res.results[resource])
      return callUntilLastPage({resource, method, params, results})
    })
    .catch((error) => {
      console.error('error gettting resource:', error)
      return Promise.reject(error)
    })
}


function crawlFromToNow () {

}
