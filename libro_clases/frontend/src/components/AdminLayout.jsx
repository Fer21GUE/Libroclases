import React from 'react';
import AdminSidebar from './AdminSidebar.jsx';

export default function AdminPageLayout({ children, title, headerActions }) {
  return (
    <div className="admin-body">
      <div className="admin-container">
        <AdminSidebar />

        <main className="admin-main">
          <header className="admin-header">
            <div>
              <h1>{title}</h1>
            </div>
            {headerActions && <div className="header-actions">{headerActions}</div>}
          </header>

          <div className="admin-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
