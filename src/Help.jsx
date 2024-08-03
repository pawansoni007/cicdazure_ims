import NavbarComponent from "./NavbarComponent";

const Help = () => {
  return (
    <>
      {/* header */}
      <header className="navbar">
        <NavbarComponent></NavbarComponent>
      </header>

      {/* headline */}
      {/* <div className="headline">
        <strong style={{ fontSize: "30px", margin: "0.5rem" }}>Help</strong>
      </div> */}

      {/*content*/}

      <div class="main-body">
        <nav id="navbar">
          <header className="headline no-headline">Help Menu</header>
          <a href="#add-shipment" class="nav-link">
            Add Shipment
          </a>
          <a href="#view-shipment" class="nav-link">
            View Shipment
          </a>
          <a href="#add-asset" class="nav-link">
            Add Asset
          </a>
          <a href="#view-asset" class="nav-link">
            View Asset
          </a>
          <a href="#teams" class="nav-link">
            View/Edit Teams
          </a>
          <a href="#category" class="nav-link">
            Add/View Category
          </a>
          <a href="#assign" class="nav-link">
            Assign Asset
          </a>
          <a href="#contact" class="nav-link">
            Contact
          </a>
        </nav>

        <main id="main-doc">
          <section class="main-section" id="add-shipment">
            <header className="section-head">Add Shipment</header>
            <p>
              Add Shipment, helps admin to add details of a shipment that has
              arrived in the office. All the details, such as Tracking ID, Date,
              Sender's Name, Receiver's Name are required for the admin to fill.
              After filling the form, the admin, is supposed to enter details of
              the Asset received by the user. This information can be added from
              a form or directly an excel can be uploaded. This is only
              accessible by Admin.
            </p>
          </section>

          <section class="main-section" id="view-shipment">
            <header>View Shipment</header>
            <p>
              View Shipment, allows to view all the shipments that have arrived
              in Fire Detection. It helps to track a package from when it has
              arrived. It specifically tracks from whom the shipment was sent
              by, who is receiving the package and which asset is assigned to
              the which team can be viewed. This is only accessible by Admin and
              can be viewed only by Managers.
            </p>
          </section>

          <section class="main-section" id="add-asset">
            <header>Add Asset</header>
            <p>
              Add Asset, allows you to add any existing asset in the Fire
              Detection. It allows to add details using a form or via importing
              excel sheet. It requires the user to information like PID,
              Material Description, Manager Email, Team Name and Category. This
              is only accessible by Admin.
            </p>
          </section>

          <section class="main-section" id="view-asset">
            <header>View Asset</header>
            <p>
              View Asset, shows all the asset present inside Fire Detection. It
              is divided into three pages, which is a hierarchical view. The
              First page shows count of all the Asset based on their PID. The
              Second page shows the Team who is owner of an Asset, also how many
              such Assets are owned by that Team. The Third Page shows the
              details of Team Member who are using a particular Asset of their
              respective Team. This is accessible by everyone.
            </p>
          </section>

          <section class="main-section" id="teams">
            <header>View/ Edit Teams</header>

            <p>
              This option allows Admin to create a new Team in the Application.
              When a Team is added, Team Members of that team can be added and
              viewed accordingly. All Teams can be edited as per the necessity.
              This is accessible by Super Admin.
            </p>
          </section>

          <section class="main-section" id="category">
            <header>View Category</header>
            <p>
              View Category, shows the category of the specific asset in Fire
              Detection. These Categories can be added, viewed and updated. All
              the asset in the organization will lie in a specific category
              criteria. This is accessible by Super Admin and can be viewed by
              Manager.
            </p>
          </section>
          <section class="main-section" id="assign">
            <header>Assign Asset</header>
            <p>
              Assign Component, allows you to assign components to a Team Member
              based on there PID. Users who are already assigned a component are
              visible here for references. This is only accessible by Admin and
              Manager.
            </p>
          </section>
          <section class="main-section" id="contact">
            <header>Contact</header>
            <p>
              Support: <a href="mailto:SupportIMS@johnsoncontrols365.onmicrosoft.com ">supportIMS@johnsoncontrols365.onmicrosoft.com</a>
            </p>
          </section>
        </main>
      </div>
    </>
  );
};

export default Help;
