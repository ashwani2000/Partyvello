import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import HelpWidgets from './HelpWidgets';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <HelpWidgets />
      <BottomNav />
    </div>
  );
}
