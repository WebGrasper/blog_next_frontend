function Search({title}) {
    
    return (
      <>
        <h1>{title}</h1>
      </>
    );
  }
  
  export const getServerSideProps = async (context) => {
    const { title } = context.query;
    return {
      props: {
        title :title
      }
    };
  };
  
  export default Search;
  