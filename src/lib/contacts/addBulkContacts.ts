import { createClient } from '@/lib/supabase/server'

interface ContactInput {
  first_name: string
  last_name: string
  phone_number: string
}

export async function addBulkContacts(contacts: ContactInput[], list_id: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  const { data: existingContacts, error: fetchError } = await supabase
    .from('contacts')
    .select('phone_number')
    .eq('user_id', user.id)

  if (fetchError) {
    console.error('Failed to fetch existing contacts:', fetchError)
    throw new Error('Could not fetch existing contacts')
  }

  const existingNumbers = new Set(
    (existingContacts ?? []).map((c) => c.phone_number)
  )
  const seenNumbers = new Set<string>()

  const uniqueContacts = contacts.filter((c) => {
    const isDuplicate = existingNumbers.has(c.phone_number) || seenNumbers.has(c.phone_number)
    if (!isDuplicate) {
      seenNumbers.add(c.phone_number)
      return true
    }
    return false
  })

  if (uniqueContacts.length === 0) {
    return []
  }

  const toInsert = uniqueContacts.map((contact) => ({
    first_name: contact.first_name || null,
    last_name: contact.last_name || null,
    phone_number: contact.phone_number || null,
    list_id,
    user_id: user.id,
  }))

  const { data, error } = await supabase
    .from('contacts')
    .insert(toInsert)
    .select('id, phone_number, first_name, last_name, created_at, lists(name)') 

  if (error) {
    console.error('Supabase insert error:', error)
    throw new Error('Failed to insert contacts')
  }

  return data || []
}
