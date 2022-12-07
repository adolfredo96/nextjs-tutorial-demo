import Head from 'next/head'
import { MongoClient } from 'mongodb'
import MeetupList from '../components/meetups/MeetupList'

const HomePage = (props) => {
  // use the props in the main component
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta name='description' content='Browse a list of random meetups' />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  )
}

// only use getServerSideProps if you need access to the request object or if you really have data that changes multiple times every second

// export async function getServerSideProps(context) {
//   //runs and updates for every request
//   const req = context.req //access to req and res object like in express
//   const res = context.res

//   //fetch data from an API

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   }
// }

export async function getStaticProps() {
  // do things like fetch from an API DB or Filesystem before rendering the page and delivering it to the client browser
  const client = await MongoClient.connect(
    'mongodb+srv://admin:admin@cluster0.w5l5i8k.mongodb.net/meetups?retryWrites=true&w=majority'
  )

  const db = client.db()

  const meetupsCollection = db.collection('meetups')

  const meetups = await meetupsCollection.find().toArray()

  client.close()

  return {
    //always return an object
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10, //regenerate page every 10 seconds to keep the data always updated depending on the frequency it changes
  }
}

export default HomePage
