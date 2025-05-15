'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // Si estamos en la página principal, no mostramos migas de pan
  if (pathname === '/') {
    return null;
  }
  
  // Dividimos la ruta en segmentos
  const segments = pathname.split('/').filter(segment => segment !== '');
  
  // Construimos las rutas acumulativas
  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    
    return {
      href,
      label,
      isLast: index === segments.length - 1
    };
  });
  
  return (
    <nav aria-label="Breadcrumb" className="py-2 text-sm">
      <ol className="flex items-center space-x-2">
        <li>
          <Link 
            href="/" 
            className="text-gray-500 hover:text-gray-700"
          >
            Inicio
          </Link>
        </li>
        
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            <span className="text-gray-400 mx-2">/</span>
            {breadcrumb.isLast ? (
              <span className="text-gray-500 font-medium">{breadcrumb.label}</span>
            ) : (
              <Link 
                href={breadcrumb.href} 
                className="text-gray-500 hover:text-gray-700"
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 