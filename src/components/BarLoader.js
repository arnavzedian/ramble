import styled from "styled-components";

const LoaderParent = styled.div`
  background: ${({ background }) => (background ? background : "#555")};
  position: relative;
  overflow: hidden;
  width: ${({ width }) => (width ? width : "500px")};
  height: 3px;
`;

const Loader = styled.div`
  position: absolute;
  background: ${({ color }) => (color ? color : "#111")};
  width: 100%;
  height: 100%;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: animateloader 1s ease-in infinite;
`;
function BarLoader(props) {
  return (
    <LoaderParent {...props}>
      <Loader {...props} />
    </LoaderParent>
  );
}

export default BarLoader;
