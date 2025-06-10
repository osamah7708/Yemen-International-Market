\`\`\`tsx
// components/Header.tsx
import React from 'react';

const Header = () => {
  return (
      <header>
            <nav>
                    <ul style={{ display: 'flex', listStyle: 'none', alignItems: 'center' }}>
                              <li>
                                          <input
                                                        type="search"
                                                                      placeholder="Search here"
                                                                                    aria-label="Search"
                                                                                                  style={{ padding: '5px', fontSize: '16px' }}
                                                                                                              />
                                                                                                                        </li>
                                                                                                                                  <li style={{ marginLeft: '20px' }}>
                                                                                                                                              <button aria-label="My Account">
                                                                                                                                                            <img src="/icons/account.svg" alt="My Account" style={{ width: '24px', height: '24px' }} />
                                                                                                                                                                        </button>
                                                                                                                                                                                  </li>
                                                                                                                                                                                            <li style={{ marginLeft: '20px' }}>
                                                                                                                                                                                                        <button aria-label="Favorites">
                                                                                                                                                                                                                      <img src="/icons/favorites.svg" alt="Favorites" style={{ width: '24px', height: '24px' }} />
                                                                                                                                                                                                                                  </button>
                                                                                                                                                                                                                                            </li>
                                                                                                                                                                                                                                                      <li style={{ marginLeft: '20px' }}>
                                                                                                                                                                                                                                                                  <button aria-label="Cart">
                                                                                                                                                                                                                                                                                <img src="/icons/cart.svg" alt="Cart" style={{ width: '24px', height: '24px' }} />
                                                                                                                                                                                                                                                                                            </button>
                                                                                                                                                                                                                                                                                                      </li>
                                                                                                                                                                                                                                                                                                              </ul>
                                                                                                                                                                                                                                                                                                                    </nav>
                                                                                                                                                                                                                                                                                                                        </header>
                                                                                                                                                                                                                                                                                                                          );
                                                                                                                                                                                                                                                                                                                          };

                                                                                                                                                                                                                                                                                                                          export default Header;

                                                                                                                                                                                                                                                                                                                          // App.tsx
                                                                                                                                                                                                                                                                                                                          import React from 'react';
                                                                                                                                                                                                                                                                                                                          import Header from './components/Header';

                                                                                                                                                                                                                                                                                                                          function App() {
                                                                                                                                                                                                                                                                                                                            return (<>
                                                                                                                                                                                                                                                                                                                                  <Header />
                                                                                                                                                                                                                                                                                                                                        {/* Rest of the app content */}
                                                                                                                                                                                                                                                                                                                                            </>
                                                                                                                                                                                                                                                                                                                                              );
                                                                                                                                                                                                                                                                                                                                              }

                                                                                                                                                                                                                                                                                                                                              export default App;
                                                                                                                                                                                                                                                                                                                                              \`\`\`
