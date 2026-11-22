
import React from "react";

const linkStyle = {
  textDecoration: "none",
  color: "#45594b",
  fontSize: "15px",
  fontWeight: "500"
};

const loginStyle = {
  padding: "11px 18px",
  border: "1px solid #218c58",
  background: "transparent",
  color: "#218c58",
  borderRadius: "7px",
  cursor: "pointer"
};

const navButtonStyle = {
  padding: "11px 20px",
  border: "none",
  backgroundColor: "#218c58",
  color: "white",
  borderRadius: "7px",
  cursor: "pointer"
};

const heroButtonStyle = {
  padding: "15px 25px",
  backgroundColor: "#218c58",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "15px",
  cursor: "pointer"
};

const secondaryButtonStyle = {
  padding: "15px 25px",
  backgroundColor: "white",
  color: "#218c58",
  border: "1px solid #218c58",
  borderRadius: "8px",
  fontSize: "15px",
  cursor: "pointer"
};

const footerLinkStyle = {
  color: "#d1dfd5",
  textDecoration: "none",
  fontSize: "15px"
};

function Home() {
  return (
    <div id="top" style={{
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f7f9f5",
      minHeight: "100vh",
      width: "100%",
      color: "#24352b",
      overflowX: "hidden"
    }}>

      {/* Navigation Bar */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "15px",
        padding: "20px 7%",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        width: "100%"
      }}>

        <h2 style={{
          color: "#218c58",
          margin: 0,
          fontSize: "27px"
        }}>
          ReVive AI ♻
        </h2>

        <div style={{
          display: "flex",
          gap: "25px",
          alignItems: "center",
          flexWrap: "wrap"
        }}>
          <a href="#top" style={linkStyle}>Home</a>
          <a href="#explore" style={linkStyle}>Explore</a>
          <a href="#how-it-works" style={linkStyle}>How It Works</a>
          <a href="#about" style={linkStyle}>About</a>
          <a
            href="/dashboard"
            style={{ ...linkStyle, color: "#218c58", fontWeight: "700" }}
          >
            Dashboard Demo
          </a>
        </div>

        <div style={{
          display: "flex",
          gap: "12px"
        }}>
          <button
          className="nav-login-btn"
          onClick={() => window.location.href = "/login"}
          >
            Login
          </button>

          <button
            className="nav-getstarted-btn"
            onClick={() => window.location.href = "/register"}
          >
            Get Started
          </button>
        </div>

      </nav>

      {/* Hero Section */}
      <section style={{
        padding: "65px 7%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "40px",
        flexWrap: "wrap",
        minHeight: "calc(100vh - 80px)",
        width: "100%",
        boxSizing: "border-box"
      }}>

        <div style={{
          flex: "1 1 350px",
          maxWidth: "580px"
        }}>

          <p style={{
            color: "#218c58",
            fontWeight: "bold",
            letterSpacing: "2px",
            fontSize: "14px"
          }}>
            ♻ SUSTAINABLE LIVING, SMARTER FUTURE
          </p>

          <h1 style={{
            fontSize: "clamp(38px, 5vw, 58px)",
            lineHeight: "1.15",
            margin: "20px 0",
            color: "#203b2c"
          }}>
            Give Your Unwanted Items
            <span style={{ color: "#269b60" }}>
              {" "}A Second Life.
            </span>
          </h1>

          <p style={{
            fontSize: "18px",
            lineHeight: "1.8",
            color: "#68776c",
            marginBottom: "30px"
          }}>
            ReVive AI helps you rediscover the value of
            unwanted items. Reuse, recycle, exchange and
            contribute towards a sustainable future with
            the power of AI.
          </p>

          <div style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap"
          }}>
            <button
              style={heroButtonStyle}
              onClick={() => window.location.href = "/dashboard?section=browse"}
            >
              Explore Items →
            </button>

            
<button
  style={secondaryButtonStyle}
  onClick={() =>
    window.location.href = "/dashboard?section=donate"
  }
>
  List an Item
</button>

          </div>

        </div>

        <div style={{
          flex: "1 1 300px",
          minHeight: "300px",
          background: "linear-gradient(135deg, #dff4e5, #b5e3c5)",
          borderRadius: "25px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "110px"
        }}>
          🌱
        </div>

      </section>

      {/* Explore Categories */}
      <section id="explore" style={{
        padding: "65px 7%",
        textAlign: "center",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>

        <p style={{
          color: "#218c58",
          fontWeight: "bold",
          letterSpacing: "2px"
        }}>
          DISCOVER AND REVIVE
        </p>

        <h2 style={{
          fontSize: "36px",
          color: "#203b2c"
        }}>
          Explore Categories
        </h2>

        <p style={{
          color: "#68776c",
          fontSize: "17px"
        }}>
          Find new possibilities in things you no longer need.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "25px",
          marginTop: "40px"
        }}>

          {[
            { icon: "👕", name: "Clothing" },
            { icon: "📱", name: "Electronics" },
            { icon: "📚", name: "Books" },
            { icon: "🪑", name: "Furniture" },
            { icon: "🏠", name: "Home Essentials" },
            { icon: "🎁", name: "Others" }
          ].map((item, index) => (
            <div key={index} style={{
              padding: "30px 15px",
              backgroundColor: "#f3f8f3",
              borderRadius: "15px",
              transition: "0.3s"
            }}>
              <div style={{ fontSize: "45px" }}>
                {item.icon}
              </div>

              <h3 style={{ color: "#294b36" }}>
                {item.name}
              </h3>
            </div>
          ))}

        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{
        padding: "65px 7%",
        textAlign: "center",
        backgroundColor: "#f0f7f0",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>

        <p style={{
          color: "#218c58",
          fontWeight: "bold",
          letterSpacing: "2px"
        }}>
          SIMPLE PROCESS
        </p>

        <h2 style={{
          fontSize: "36px",
          color: "#203b2c"
        }}>
          How ReVive AI Works
        </h2>

        <p style={{
          color: "#68776c",
          fontSize: "17px"
        }}>
          Give your unwanted items a meaningful second life in three steps.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "25px",
          marginTop: "45px"
        }}>

          {[
            {
              icon: "📸",
              title: "1. Upload Your Item",
              desc: "Upload a picture and basic details of the item you no longer need."
            },
            {
              icon: "🤖",
              title: "2. AI Analysis",
              desc: "Let AI help identify your item and explore suitable reuse possibilities."
            },
            {
              icon: "♻️",
              title: "3. Revive Its Value",
              desc: "Discover opportunities to reuse, exchange, donate or recycle."
            }
          ].map((step, index) => (
            <div key={index} style={{
              padding: "35px 22px",
              backgroundColor: "white",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.04)"
            }}>
              <div style={{ fontSize: "45px" }}>
                {step.icon}
              </div>

              <h3 style={{ color: "#218c58" }}>
                {step.title}
              </h3>

              <p style={{
                color: "#68776c",
                lineHeight: "1.7"
              }}>
                {step.desc}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{
        padding: "65px 10%",
        textAlign: "center",
        backgroundColor: "#ffffff",
        minHeight: "75vh",
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>

        <p style={{
          color: "#218c58",
          fontWeight: "bold",
          letterSpacing: "2px"
        }}>
          ABOUT OUR MISSION
        </p>

        <h2 style={{
          fontSize: "36px",
          color: "#203b2c"
        }}>
          A Smarter Way to Reduce Waste
        </h2>

        <p style={{
          maxWidth: "750px",
          margin: "20px auto",
          color: "#68776c",
          fontSize: "17px",
          lineHeight: "1.9"
        }}>
          ReVive AI is designed to transform the way people think
          about unwanted items. By combining artificial intelligence
          with sustainable practices, we aim to encourage reuse,
          responsible recycling and a circular economy.
          Every item deserves a second chance!
        </p>

      </section>

      {/* Bottom Message */}
      <section style={{
        textAlign: "center",
        padding: "35px 15px",
        backgroundColor: "#eaf5ec",
        width: "100%"
      }}>
        <h2 style={{ color: "#218c58" }}>
          Small Actions. Big Impact.
        </h2>
        <p style={{ color: "#68776c" }}>
          Reuse more. Waste less. Revive the future.
        </p>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: "#203b2c",
        color: "white",
        padding: "45px 7% 20px",
        width: "100%"
      }}>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "35px"
        }}>

          <div>
            <h2 style={{ color: "#65d69a" }}>
              ReVive AI ♻
            </h2>

            <p style={{
              color: "#d1dfd5",
              lineHeight: "1.8"
            }}>
              Give your unwanted items a second life.
              Together, let's build a sustainable future.
            </p>
          </div>

          <div>
            <h3>Quick Links</h3>
            <p><a href="#top" style={footerLinkStyle}>Home</a></p>
            <p><a href="#explore" style={footerLinkStyle}>Explore</a></p>
            <p><a href="#how-it-works" style={footerLinkStyle}>How It Works</a></p>
            <p><a href="#about" style={footerLinkStyle}>About Us</a></p>
            <p><a href="/dashboard" style={footerLinkStyle}>Dashboard Demo</a></p>
          </div>

          <div>
            <h3>Our Mission</h3>

            <p style={{
              color: "#d1dfd5",
              lineHeight: "1.8"
            }}>
              Reduce waste, encourage reuse and
              promote responsible recycling through AI.
            </p>
          </div>

        </div>

        <div style={{
          borderTop: "1px solid #526b5b",
          marginTop: "35px",
          paddingTop: "20px",
          textAlign: "center",
          color: "#d1dfd5"
        }}>
          © 2026 ReVive AI. All rights reserved.

          <p>Reuse More. Waste Less. Revive the Future. 🌱</p>
        </div>

      </footer>

    </div>  
  );
}

export default Home;
