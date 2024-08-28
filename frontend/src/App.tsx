import {useQuery, gql} from "@apollo/client";

const GET_BOOKS = gql`
  query books {
    books {
      title
      author
    }
  }
`;

export default function App() {
  const {loading, error, data} = useQuery(GET_BOOKS);

  if (loading) return loading;
  if (error) return error.message;
  if (data) {
    const books: {title: string; author: string}[] = data.books;
    return books.map((book) => (
      <>
        <h3>{book.title}</h3>
        <p>{book.author}</p>
      </>
    ));
  }
}
