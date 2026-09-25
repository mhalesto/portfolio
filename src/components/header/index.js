import SiteHeader from '../../site/components/Header';

// Product, privacy and support pages sit on a light background, so they get
// the always-visible glass version of the site header.
const Header = () => <SiteHeader tone="solid" />;

export default Header;
