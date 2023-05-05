import { useMatches } from 'react-router-dom'

const CustomBreadcrumbs: React.FC = () => {
  const matches = useMatches()
  console.log(matches)
  /* let crumbs = matches
    // first get rid of any matches that don't have handle and crumb
    .filter((match: any) => Boolean(match.handle?.crumb))
    // now map them into an array of elements, passing the loader
    // data to each one
    .map((match: any) => match.handle.crumb(match.data)) */
  {
    /* <ol>
      {crumbs.map((crumb, index) => (
        <li key={index}>{crumb}</li>
      ))}
    </ol> */
  }
  return <h1>Test</h1>
}

export default CustomBreadcrumbs
