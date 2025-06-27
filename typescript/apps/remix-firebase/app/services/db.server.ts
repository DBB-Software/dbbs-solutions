import { db } from './firebase.server'
import { SavedSearch } from '../types/searches'

export const getSavedSearches = async (userId: string): Promise<SavedSearch[]> => {
  const snapshot = await db.collection('searches').where('userId', '==', userId).select('path', 'title').get()

  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as SavedSearch[]
}

export const saveSearch = async (data: { userId: string; title: string; path: string }) =>
  db.collection('searches').doc().set(data)

export const deleteSavedSearch = async (searchId: string) => db.collection('searches').doc(searchId).delete()

export const getSavedSearch = async (path: string, userId: string): Promise<SavedSearch | null> => {
  const snapshot = await db.collection('searches').where('userId', '==', userId).where('path', '==', path).get()

  if (snapshot.empty) {
    return null
  }

  const doc = snapshot.docs[0]

  return {
    id: doc.id,
    ...doc.data()
  } as SavedSearch
}
