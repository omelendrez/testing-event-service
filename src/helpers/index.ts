import { IMessageBody, Person } from '../entities'

export const NAME_TYPE = {
  ROUNDER: 1,
  PATIENT: 2
}

const patients: Person[] = [
  { id: 1, name: 'Jacqueline Mcgowan' },
  { id: 2, name: 'Sean Thai' },
  { id: 3, name: 'Journey Fain' },
  { id: 4, name: 'Rose Sprague' },
  { id: 5, name: 'Isabel Manuel' },
  { id: 6, name: 'Theodore Sanford' },
  { id: 7, name: 'Silas Ginn' },
  { id: 8, name: 'Isla Flick' },
  { id: 9, name: 'Duane Warren' },
  { id: 10, name: 'Judy Magee' }
]

const rounders: Person[] = [
  { id: 1, name: 'Joyce Nevarez' },
  { id: 2, name: 'Isabel Glick' },
  { id: 3, name: 'Scott Mayer' },
  { id: 4, name: 'Neal Barry' },
  { id: 5, name: 'Bentley Burrows' }
]

export const abbreviateName = (fullName: string): string => {
  const [firstName, lastName] = fullName.split(' ')

  return `${firstName.toLocaleUpperCase()} ${lastName
    .charAt(0)
    .toLocaleUpperCase()}`
}

const getRandomPerson = (type: number): Person => {
  let list: Person[] = type === NAME_TYPE.ROUNDER ? rounders : patients

  return list[Math.floor(Math.random() * list.length)]
}

const getRandomFloor = (): string => {
  const i = Math.floor(Math.random() * 10) + 1

  let j = i % 10,
    k = i % 100

  if (j === 1 && k !== 11) {
    return i + 'st'
  }

  if (j === 2 && k !== 12) {
    return i + 'nd'
  }

  if (j === 3 && k !== 13) {
    return i + 'rd'
  }

  return i + 'th'
}

export const generateMockAlertInfo = (): IMessageBody => ({
  rounder: getRandomPerson(NAME_TYPE.ROUNDER),
  patient: getRandomPerson(NAME_TYPE.PATIENT),
  delay: `${Math.floor(Math.random() * 5) + 1} minutes`,
  location: `${getRandomFloor()} Floor`
})
