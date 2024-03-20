export default function Home(parama: { color: any }) {
  console.log(parama.color);

  return <div className="container">Hello 1</div>;
}

Home.getInitialProps = () => {
  console.log("I am on the server!");

  return { color: "red" };
};
