import Head from 'next/head'
import MeetupDetail from '../../components/meetups/MeetupDetail'
import { MongoClient, ObjectId } from 'mongodb'

const MeetUpDetails = (props) => {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name='description' content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  )
}

export const getStaticPaths = async () => {
  const client = await MongoClient.connect(
    'mongodb+srv://admin:admin@cluster0.w5l5i8k.mongodb.net/meetups?retryWrites=true&w=majority'
  )

  const db = client.db()

  const meetupsCollection = db.collection('meetups')

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray() //only include the ID but no other field values

  client.close()

  return {
    fallback: false, // indicates wheter you inserted all suported paths, false means you did, true means only some of the supported are listed
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  }
}

export const getStaticProps = async (context) => {
  //fetch data for a single meetup

  const meetupId = context.params.meetupId

  const client = await MongoClient.connect(
    'mongodb+srv://admin:admin@cluster0.w5l5i8k.mongodb.net/meetups?retryWrites=true&w=majority'
  )

  const db = client.db()

  const meetupsCollection = db.collection('meetups')

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  })

  client.close()

  console.log(selectedMeetup)
  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  }
}

export default MeetUpDetails
