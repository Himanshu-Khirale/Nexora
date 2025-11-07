import { NavLink } from 'react-router-dom';

interface AppHeaderProps {
  itemCount: number;
  total: number;
}

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'app-nav__link is-active' : 'app-nav__link';

export const AppHeader = ({ itemCount, total }: AppHeaderProps) => (
  <header className="app-header">
    <div className="app-header__top">
      <div>
        <h1>Vibe Commerce Cart</h1>
        <p>Shop curated lifestyle picks and check out with ease.</p>
      </div>
      <div className="app-header__summary">
        <span>{itemCount} items</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
    </div>
    <nav className="app-nav">
      <NavLink to="/" className={linkClasses} end>
        Shop
      </NavLink>
      <NavLink to="/cart" className={linkClasses}>
        Cart
      </NavLink>
      <NavLink to="/checkout" className={linkClasses}>
        Checkout
      </NavLink>
    </nav>
  </header>
);

