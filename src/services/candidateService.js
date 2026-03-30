import dataCandidate from '@/stores/dataCandidate'
const STORAGE_KEY = 'candidateList'
const SEARCHABLE_FIELDS = [
  'fullName',
  'dob',
  'gender',
  'region',
  'phone',
  'email',
  'country',
  'city',
  'ward',
  'address',
]

export const candidateService = {
  getAll,
  search,
  getPaginated,
  save,
  create,
  remove,
}
function getAll() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY))
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataCandidate))
    return dataCandidate
  }
  return data
}
function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
function create(newItem) {
  const list = getAll()
  list.push(newItem)
  save(list)
}

function remove(id) {
  const list = getAll().filter((item) => item.id !== id)
  save(list)
}
