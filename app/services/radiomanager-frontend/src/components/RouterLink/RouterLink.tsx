import * as PropTypes from "prop-types"
import * as React from "react"
import { useCallback } from "react"
import { useHistory } from "react-router-dom"

type Props = Omit<React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "onClick">

const RouterLink: React.FC<Props> = ({ href, ...otherProps }) => {
  const history = useHistory()

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (href) {
        history.push(href)
      }
      e.preventDefault()
    },
    [href, history],
  )

  return <a {...otherProps} href={href} onClick={handleClick} />
}

RouterLink.propTypes = {
  href: PropTypes.string.isRequired,
}

export default RouterLink
