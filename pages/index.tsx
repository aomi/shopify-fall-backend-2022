import { GetServerSideProps } from 'next';

export default function Home() {
  return (
    <noscript>
      Placeholder for redirect
    </noscript>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      permanent: false,
      destination: '/api/graphql',
    },
  };
};

