// This function converts the string to lowercase, then perform the conversion
const AllowedExtension = [
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'jpg',
  'jpeg',
  'png',
  'gif',
  'mp4',
  'avi ',
  'wmv',
  'mp3',
  'wav',
  'txt',
]

// This function keeps the casing unchanged for str, then perform the conversion
const CheckExtension = (fileExtension: string) => {
  const result = AllowedExtension.filter((element) => element === fileExtension)
  if (result.length === 0) {
    return false
  } else {
    return true
  }
}

export { CheckExtension }
