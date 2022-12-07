import Head from 'next/head'
import { useRouter } from 'next/router'
import NewMeetupForm from '../../components/meetups/NewMeetupForm'

const NewMeetup = () => {
  const router = useRouter()
  const addMeetupHandler = async (meetupData) => {
    const response = await fetch('/api/new-meetup', {
      method: 'POST',
      body: JSON.stringify(meetupData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()

    console.log(data)

    router.replace('/')
  }
  return (
    <>
      <Head>
        <title>Add a new meetup</title>
        <meta
          name='description'
          content='Add your own meetups and create amazing network opportunities'
        />
      </Head>
      <NewMeetupForm onAddMeetup={addMeetupHandler} />
    </>
  )
}
export default NewMeetup
