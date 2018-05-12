// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript

function fallbackCopyTextToClipboard (text) {
  var textArea = document.createElement('textarea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  let returnObj = {}

  try {
    var successful = document.execCommand('copy')
    var msg = successful ? 'successful' : 'unsuccessful'
    // console.log('Fallback: Copying text command was ' + msg)
    returnObj = {
      status: true,
      message: msg
    }
  } catch (error) {
    // console.error('Fallback: Oops, unable to copy', err)
    returnObj = {
      status: false,
      message: 'Copy failed',
      error
    }
  }

  document.body.removeChild(textArea)
  return returnObj
}

export function copyTextToClipboard (text) {
  if (!navigator.clipboard) {
    return fallbackCopyTextToClipboard(text)
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log('Async: Copying to clipboard was successful!')
      return {
        status: true,
        message: 'Copy successful!'
      }
    },
    function (err) {
      console.error('Async: Could not copy text: ', err)
      return {
        status: 'false',
        message: 'Copy failed!'
      }
    }
  )
}
