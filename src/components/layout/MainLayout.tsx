import { Header } from './Header';
import { Footer } from './Footer';
import { SkipLink } from './SkipLink';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

export async function MainLayout({ children, currentPath }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <SkipLink />
      <Header currentPath={currentPath} />
      <main
        id="main-content"
        tabIndex={-1}
        role="main"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
