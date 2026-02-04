// src/components/FooterComponent.jsx
function FooterComponent() {
  return (
    <footer className="bg-dark text-white text-center py-4 mt-auto">
      <div className="container">
        <p className="mb-2">
          © {new Date().getFullYear()} Travel Buddy – All Rights Reserved
        </p>
        <p className="mb-0 text-muted small">
          Made with <span className="text-danger">❤️</span> in Amsterdam
        </p>
      </div>
    </footer>
  );
}

export default FooterComponent;