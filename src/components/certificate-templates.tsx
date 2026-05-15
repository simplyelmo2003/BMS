interface CertificateData {
  full_name: string;
  address: string;
  purpose: string;
  token: string;
}

export const CertificateOfResidency = (data: CertificateData): string => {
  return `
    <div style="
      font-family: 'Times New Roman', serif;
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
      padding: 0;
      background-color: white;
      position: relative;
      box-sizing: border-box;
      overflow: hidden;
    ">
      <!-- Left Decorative Border -->
      <div style="
        position: absolute;
        left: 0;
        top: 0;
        width: 20px;
        height: 150px;
        background-color: #4CAF50;
        clip-path: polygon(100% 0%, 0% 0%, 0% 70%, 100% 100%);
      "></div>

      <!-- Bottom Right Decorative Corner -->
      <div style="
        position: absolute;
        right: 0;
        bottom: 0;
        width: 80px;
        height: 80px;
        background-color: #4CAF50;
        clip-path: polygon(100% 0%, 100% 100%, 0% 100%);
      "></div>

      <!-- Main Content Area -->
      <div style="padding: 20mm 20mm 20mm 25mm; position: relative; z-index: 1;">
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 12px;">
          <img
            src="/src/assets/sanroquelogo.jpg"
            alt="Barangay Logo"
            style="width: 65px; height: 65px; margin-bottom: 5px;"
          />
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Republic of the Philippines</div>
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Province of Rizal</div>
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Municipality of Rodriguez</div>
          <div style="font-size: 15px; font-weight: bold; margin-top: 5px;">BARANGAY SAN ROQUE</div>
          <div style="font-size: 10px; margin-top: 2px; font-weight: bold;">OFFICE OF THE PUNONG BARANGAY</div>
        </div>

        <!-- Certificate Title in Box -->
        <div style="
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          text-transform: uppercase;
          margin: 18px 40px;
          padding: 12px 15px;
          border: 2px solid #333;
          background-color: #f5f5f5;
        ">
          CERTIFICATE OF RESIDENCY
        </div>

        <!-- Certificate Content -->
        <div style="font-size: 13px; line-height: 1.6; text-align: justify; margin: 18px 0;">
          <div style="text-align: left; margin-bottom: 12px;">
            <strong>To whom it may concern:</strong>
          </div>

          <p style="text-indent: 35px; margin-bottom: 12px;">
            This is to certify that <strong>${data.full_name}</strong>, of legal age, Filipino citizen, and a resident of <strong>${data.address}</strong>, Barangay San Roque, Rodriguez, Rizal, Philippines, has been residing here for the required period.
          </p>

          <p style="text-indent: 35px; margin-bottom: 12px;">
            This certification is issued to attest to the residency of the above-named person in this Barangay and is being issued upon his/her request for the purpose of <strong>${data.purpose}</strong>.
          </p>

          <p style="text-indent: 35px; margin-bottom: 18px;">
            Issued this <strong>${new Date().getDate()}</strong> day of <strong>${new Date().toLocaleDateString('en-US', { month: 'long' })}</strong>, <strong>${new Date().getFullYear()}</strong> at Barangay San Roque, Rodriguez, Rizal.
          </p>
        </div>

        <!-- Signatures Section -->
        <div style="margin-top: 35px;">
          <div style="text-align: right; margin-bottom: 12px;">
            <strong>Certified/Attested by:</strong>
          </div>
          <div style="text-align: right; margin-bottom: 35px;">
            <div style="border-bottom: 1px solid black; width: 160px; margin-left: auto; margin-bottom: 2px;"></div>
            <div style="font-size: 12px; font-weight: bold;">PUNONG BARANGAY</div>
            <div style="font-size: 11px;">Barangay San Roque</div>
          </div>

          <div style="text-align: right;">
            <strong>With the authority of the Punong Barangay:</strong>
          </div>
          <div style="text-align: right;">
            <div style="border-bottom: 1px solid black; width: 160px; margin-left: auto; margin-bottom: 2px; margin-top: 28px;"></div>
            <div style="font-size: 12px; font-weight: bold;">BARANGAY SECRETARY</div>
          </div>
        </div>
      </div>

      <!-- Footer Notes -->
      <div style="
        position: absolute;
        bottom: 12mm;
        left: 25mm;
        right: 25mm;
        font-size: 9px;
        text-align: center;
        line-height: 1.3;
      ">
        <div style="color: #666; margin-bottom: 3px;">Note: This certification is not valid if it is containing erasures and alterations.</div>
        <div style="color: #d32f2f; font-weight: bold;">Not valid without the Barangay seal.</div>
      </div>
    </div>
  `;
};

export const BarangayCertificate = (data: CertificateData): string => {
  return `
    <div style="
      font-family: 'Times New Roman', serif;
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
      padding: 0;
      background-color: white;
      position: relative;
      box-sizing: border-box;
      overflow: hidden;
    ">
      <!-- Left Decorative Border -->
      <div style="
        position: absolute;
        left: 0;
        top: 0;
        width: 20px;
        height: 150px;
        background-color: #4CAF50;
        clip-path: polygon(100% 0%, 0% 0%, 0% 70%, 100% 100%);
      "></div>

      <!-- Bottom Right Decorative Corner -->
      <div style="
        position: absolute;
        right: 0;
        bottom: 0;
        width: 80px;
        height: 80px;
        background-color: #4CAF50;
        clip-path: polygon(100% 0%, 100% 100%, 0% 100%);
      "></div>

      <!-- Main Content Area -->
      <div style="padding: 20mm 20mm 20mm 25mm; position: relative; z-index: 1;">
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 12px;">
          <img
            src="/src/assets/sanroquelogo.jpg"
            alt="Barangay Logo"
            style="width: 65px; height: 65px; margin-bottom: 5px;"
          />
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Republic of the Philippines</div>
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Province of Rizal</div>
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Municipality of Rodriguez</div>
          <div style="font-size: 15px; font-weight: bold; margin-top: 5px;">BARANGAY SAN ROQUE</div>
          <div style="font-size: 10px; margin-top: 2px; font-weight: bold;">OFFICE OF THE PUNONG BARANGAY</div>
        </div>

        <!-- Certificate Title in Box -->
        <div style="
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          text-transform: uppercase;
          margin: 18px 40px;
          padding: 12px 15px;
          border: 2px solid #333;
          background-color: #f5f5f5;
        ">
          BARANGAY CERTIFICATE
        </div>

        <!-- Certificate Content -->
        <div style="font-size: 13px; line-height: 1.6; text-align: justify; margin: 18px 0;">
          <div style="text-align: left; margin-bottom: 12px;">
            <strong>To whom it may concern:</strong>
          </div>

          <p style="text-indent: 35px; margin-bottom: 12px;">
            This is to certify that <strong>${data.full_name}</strong>, of legal age, Filipino citizen, and a resident of <strong>${data.address}</strong>, Barangay San Roque, Rodriguez, Rizal, Philippines.
          </p>

          <p style="text-indent: 35px; margin-bottom: 12px;">
            This certification is issued to certify the foregoing and is being issued upon the request of the above-named person for the purpose of <strong>${data.purpose}</strong>.
          </p>

          <p style="text-indent: 35px; margin-bottom: 18px;">
            Issued this <strong>${new Date().getDate()}</strong> day of <strong>${new Date().toLocaleDateString('en-US', { month: 'long' })}</strong>, <strong>${new Date().getFullYear()}</strong> at Barangay San Roque, Rodriguez, Rizal.
          </p>
        </div>

        <!-- Signatures Section -->
        <div style="margin-top: 35px;">
          <div style="text-align: right; margin-bottom: 12px;">
            <strong>Certified/Attested by:</strong>
          </div>
          <div style="text-align: right; margin-bottom: 35px;">
            <div style="border-bottom: 1px solid black; width: 160px; margin-left: auto; margin-bottom: 2px;"></div>
            <div style="font-size: 12px; font-weight: bold;">PUNONG BARANGAY</div>
            <div style="font-size: 11px;">Barangay San Roque</div>
          </div>

          <div style="text-align: right;">
            <strong>With the authority of the Punong Barangay:</strong>
          </div>
          <div style="text-align: right;">
            <div style="border-bottom: 1px solid black; width: 160px; margin-left: auto; margin-bottom: 2px; margin-top: 28px;"></div>
            <div style="font-size: 12px; font-weight: bold;">BARANGAY SECRETARY</div>
          </div>
        </div>
      </div>

      <!-- Footer Notes -->
      <div style="
        position: absolute;
        bottom: 12mm;
        left: 25mm;
        right: 25mm;
        font-size: 9px;
        text-align: center;
        line-height: 1.3;
      ">
        <div style="color: #666; margin-bottom: 3px;">Note: This certification is not valid if it is containing erasures and alterations.</div>
        <div style="color: #d32f2f; font-weight: bold;">Not valid without the Barangay seal.</div>
      </div>
    </div>
  `;
};

export const BarangayClearance = (data: CertificateData): string => {
  return `
    <div style="
      font-family: 'Times New Roman', serif;
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
      padding: 0;
      background-color: white;
      position: relative;
      box-sizing: border-box;
      overflow: hidden;
    ">
      <!-- Left Decorative Border -->
      <div style="
        position: absolute;
        left: 0;
        top: 0;
        width: 20px;
        height: 150px;
        background-color: #4CAF50;
        clip-path: polygon(100% 0%, 0% 0%, 0% 70%, 100% 100%);
      "></div>

      <!-- Bottom Right Decorative Corner -->
      <div style="
        position: absolute;
        right: 0;
        bottom: 0;
        width: 80px;
        height: 80px;
        background-color: #4CAF50;
        clip-path: polygon(100% 0%, 100% 100%, 0% 100%);
      "></div>

      <!-- Main Content Area -->
      <div style="padding: 20mm 20mm 20mm 25mm; position: relative; z-index: 1;">
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 12px;">
          <img
            src="/src/assets/sanroquelogo.jpg"
            alt="Barangay Logo"
            style="width: 65px; height: 65px; margin-bottom: 5px;"
          />
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Republic of the Philippines</div>
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Province of Rizal</div>
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Municipality of Rodriguez</div>
          <div style="font-size: 15px; font-weight: bold; margin-top: 5px;">BARANGAY SAN ROQUE</div>
          <div style="font-size: 10px; margin-top: 2px; font-weight: bold;">OFFICE OF THE PUNONG BARANGAY</div>
        </div>

        <!-- Certificate Title in Box -->
        <div style="
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          text-transform: uppercase;
          margin: 18px 40px;
          padding: 12px 15px;
          border: 2px solid #333;
          background-color: #f5f5f5;
        ">
          BARANGAY CLEARANCE
        </div>

        <!-- Certificate Content -->
        <div style="font-size: 13px; line-height: 1.6; text-align: justify; margin: 18px 0;">
          <div style="text-align: left; margin-bottom: 12px;">
            <strong>To whom it may concern:</strong>
          </div>

          <p style="text-indent: 35px; margin-bottom: 12px;">
            This is to certify that <strong>${data.full_name}</strong>, of legal age, Filipino citizen, and a resident of <strong>${data.address}</strong>, Barangay San Roque, Rodriguez, Rizal, Philippines, has not been reported to have committed any criminal offense in this Barangay.
          </p>

          <p style="text-indent: 35px; margin-bottom: 12px;">
            Based on our records, the above-named person is cleared and has a good character as a member of this community.
          </p>

          <p style="text-indent: 35px; margin-bottom: 18px;">
            Issued this <strong>${new Date().getDate()}</strong> day of <strong>${new Date().toLocaleDateString('en-US', { month: 'long' })}</strong>, <strong>${new Date().getFullYear()}</strong> at Barangay San Roque, Rodriguez, Rizal upon the request of the above-named person for <strong>${data.purpose}</strong>.
          </p>
        </div>

        <!-- Signatures Section -->
        <div style="margin-top: 35px;">
          <div style="text-align: right; margin-bottom: 12px;">
            <strong>Certified/Attested by:</strong>
          </div>
          <div style="text-align: right; margin-bottom: 35px;">
            <div style="border-bottom: 1px solid black; width: 160px; margin-left: auto; margin-bottom: 2px;"></div>
            <div style="font-size: 12px; font-weight: bold;">PUNONG BARANGAY</div>
            <div style="font-size: 11px;">Barangay San Roque</div>
          </div>

          <div style="text-align: right;">
            <strong>With the authority of the Punong Barangay:</strong>
          </div>
          <div style="text-align: right;">
            <div style="border-bottom: 1px solid black; width: 160px; margin-left: auto; margin-bottom: 2px; margin-top: 28px;"></div>
            <div style="font-size: 12px; font-weight: bold;">BARANGAY SECRETARY</div>
          </div>
        </div>
      </div>

      <!-- Footer Notes -->
      <div style="
        position: absolute;
        bottom: 12mm;
        left: 25mm;
        right: 25mm;
        font-size: 9px;
        text-align: center;
        line-height: 1.3;
      ">
        <div style="color: #666; margin-bottom: 3px;">Note: This certification is not valid if it is containing erasures and alterations.</div>
        <div style="color: #d32f2f; font-weight: bold;">Not valid without the Barangay seal.</div>
      </div>
    </div>
  `;
};

export const BusinessClearance = (data: CertificateData): string => {
  return `
    <div style="
      font-family: 'Times New Roman', serif;
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
      padding: 0;
      background-color: white;
      position: relative;
      box-sizing: border-box;
      overflow: hidden;
    ">
      <!-- Left Decorative Border -->
      <div style="
        position: absolute;
        left: 0;
        top: 0;
        width: 20px;
        height: 150px;
        background-color: #4CAF50;
        clip-path: polygon(100% 0%, 0% 0%, 0% 70%, 100% 100%);
      "></div>

      <!-- Bottom Right Decorative Corner -->
      <div style="
        position: absolute;
        right: 0;
        bottom: 0;
        width: 80px;
        height: 80px;
        background-color: #4CAF50;
        clip-path: polygon(100% 0%, 100% 100%, 0% 100%);
      "></div>

      <!-- Main Content Area -->
      <div style="padding: 20mm 20mm 20mm 25mm; position: relative; z-index: 1;">
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 12px;">
          <img
            src="/src/assets/sanroquelogo.jpg"
            alt="Barangay Logo"
            style="width: 65px; height: 65px; margin-bottom: 5px;"
          />
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Republic of the Philippines</div>
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Province of Rizal</div>
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Municipality of Rodriguez</div>
          <div style="font-size: 15px; font-weight: bold; margin-top: 5px;">BARANGAY SAN ROQUE</div>
          <div style="font-size: 10px; margin-top: 2px; font-weight: bold;">OFFICE OF THE PUNONG BARANGAY</div>
        </div>

        <!-- Certificate Title in Box -->
        <div style="
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          text-transform: uppercase;
          margin: 18px 40px;
          padding: 12px 15px;
          border: 2px solid #333;
          background-color: #f5f5f5;
        ">
          BUSINESS CLEARANCE
        </div>

        <!-- Certificate Content -->
        <div style="font-size: 13px; line-height: 1.6; text-align: justify; margin: 18px 0;">
          <div style="text-align: left; margin-bottom: 12px;">
            <strong>To whom it may concern:</strong>
          </div>

          <p style="text-indent: 35px; margin-bottom: 12px;">
            This is to certify that <strong>${data.full_name}</strong>, of legal age, Filipino citizen, and a resident of <strong>${data.address}</strong>, Barangay San Roque, Rodriguez, Rizal, Philippines, has been cleared for business operation.
          </p>

          <p style="text-indent: 35px; margin-bottom: 12px;">
            The above-named person is authorized to engage in business activities in this Barangay and has complied with all Barangay requirements and regulations.
          </p>

          <p style="text-indent: 35px; margin-bottom: 18px;">
            Issued this <strong>${new Date().getDate()}</strong> day of <strong>${new Date().toLocaleDateString('en-US', { month: 'long' })}</strong>, <strong>${new Date().getFullYear()}</strong> at Barangay San Roque, Rodriguez, Rizal upon the request of the above-named person for <strong>${data.purpose}</strong>.
          </p>
        </div>

        <!-- Signatures Section -->
        <div style="margin-top: 35px;">
          <div style="text-align: right; margin-bottom: 12px;">
            <strong>Certified/Attested by:</strong>
          </div>
          <div style="text-align: right; margin-bottom: 35px;">
            <div style="border-bottom: 1px solid black; width: 160px; margin-left: auto; margin-bottom: 2px;"></div>
            <div style="font-size: 12px; font-weight: bold;">PUNONG BARANGAY</div>
            <div style="font-size: 11px;">Barangay San Roque</div>
          </div>

          <div style="text-align: right;">
            <strong>With the authority of the Punong Barangay:</strong>
          </div>
          <div style="text-align: right;">
            <div style="border-bottom: 1px solid black; width: 160px; margin-left: auto; margin-bottom: 2px; margin-top: 28px;"></div>
            <div style="font-size: 12px; font-weight: bold;">BARANGAY SECRETARY</div>
          </div>
        </div>
      </div>

      <!-- Footer Notes -->
      <div style="
        position: absolute;
        bottom: 12mm;
        left: 25mm;
        right: 25mm;
        font-size: 9px;
        text-align: center;
        line-height: 1.3;
      ">
        <div style="color: #666; margin-bottom: 3px;">Note: This certification is not valid if it is containing erasures and alterations.</div>
        <div style="color: #d32f2f; font-weight: bold;">Not valid without the Barangay seal.</div>
      </div>
    </div>
  `;
};

export const CertificateOfLowIncomeType1 = (data: CertificateData): string => {
  return `
    <div style="
      font-family: 'Times New Roman', serif;
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
      padding: 0;
      background-color: white;
      position: relative;
      box-sizing: border-box;
      overflow: hidden;
    ">
      <!-- Left Decorative Border -->
      <div style="
        position: absolute;
        left: 0;
        top: 0;
        width: 20px;
        height: 150px;
        background-color: #4CAF50;
        clip-path: polygon(100% 0%, 0% 0%, 0% 70%, 100% 100%);
      "></div>

      <!-- Bottom Right Decorative Corner -->
      <div style="
        position: absolute;
        right: 0;
        bottom: 0;
        width: 80px;
        height: 80px;
        background-color: #4CAF50;
        clip-path: polygon(100% 0%, 100% 100%, 0% 100%);
      "></div>

      <!-- Main Content Area -->
      <div style="padding: 20mm 20mm 20mm 25mm; position: relative; z-index: 1;">
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 12px;">
          <img
            src="/src/assets/sanroquelogo.jpg"
            alt="Barangay Logo"
            style="width: 65px; height: 65px; margin-bottom: 5px;"
          />
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Republic of the Philippines</div>
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Province of Rizal</div>
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Municipality of Rodriguez</div>
          <div style="font-size: 15px; font-weight: bold; margin-top: 5px;">BARANGAY SAN ROQUE</div>
          <div style="font-size: 10px; margin-top: 2px; font-weight: bold;">OFFICE OF THE PUNONG BARANGAY</div>
        </div>

        <!-- Certificate Title in Box -->
        <div style="
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          text-transform: uppercase;
          margin: 18px 40px;
          padding: 12px 15px;
          border: 2px solid #333;
          background-color: #f5f5f5;
        ">
          CERTIFICATE OF LOW INCOME
        </div>

        <!-- Certificate Content -->
        <div style="font-size: 13px; line-height: 1.6; text-align: justify; margin: 18px 0;">
          <div style="text-align: left; margin-bottom: 12px;">
            <strong>To whom it may concern:</strong>
          </div>

          <p style="text-indent: 35px; margin-bottom: 12px;">
            This is to certify that <strong>${data.full_name}</strong>, of legal age, Filipino citizen, and a resident of <strong>${data.address}</strong>, Barangay San Roque, Rodriguez, Rizal, Philippines, is a person with limited economic capacity.
          </p>

          <p style="text-indent: 35px; margin-bottom: 12px;">
            Based on the records of this Barangay, the above-named person belongs to the low-income sector and requires assistance for educational, medical, or other social programs.
          </p>

          <p style="text-indent: 35px; margin-bottom: 18px;">
            Issued this <strong>${new Date().getDate()}</strong> day of <strong>${new Date().toLocaleDateString('en-US', { month: 'long' })}</strong>, <strong>${new Date().getFullYear()}</strong> at Barangay San Roque, Rodriguez, Rizal upon the request of the above-named person for <strong>${data.purpose}</strong>.
          </p>
        </div>

        <!-- Signatures Section -->
        <div style="margin-top: 35px;">
          <div style="text-align: right; margin-bottom: 12px;">
            <strong>Certified/Attested by:</strong>
          </div>
          <div style="text-align: right; margin-bottom: 35px;">
            <div style="border-bottom: 1px solid black; width: 160px; margin-left: auto; margin-bottom: 2px;"></div>
            <div style="font-size: 12px; font-weight: bold;">PUNONG BARANGAY</div>
            <div style="font-size: 11px;">Barangay San Roque</div>
          </div>

          <div style="text-align: right;">
            <strong>With the authority of the Punong Barangay:</strong>
          </div>
          <div style="text-align: right;">
            <div style="border-bottom: 1px solid black; width: 160px; margin-left: auto; margin-bottom: 2px; margin-top: 28px;"></div>
            <div style="font-size: 12px; font-weight: bold;">BARANGAY SECRETARY</div>
          </div>
        </div>
      </div>

      <!-- Footer Notes -->
      <div style="
        position: absolute;
        bottom: 12mm;
        left: 25mm;
        right: 25mm;
        font-size: 9px;
        text-align: center;
        line-height: 1.3;
      ">
        <div style="color: #666; margin-bottom: 3px;">Note: This certification is not valid if it is containing erasures and alterations.</div>
        <div style="color: #d32f2f; font-weight: bold;">Not valid without the Barangay seal.</div>
      </div>
    </div>
  `;
};

export const CertificateOfLowIncomeType2 = (data: CertificateData): string => {
  return `
    <div style="
      font-family: 'Times New Roman', serif;
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
      padding: 0;
      background-color: white;
      position: relative;
      box-sizing: border-box;
      overflow: hidden;
    ">
      <!-- Left Decorative Border -->
      <div style="
        position: absolute;
        left: 0;
        top: 0;
        width: 20px;
        height: 150px;
        background-color: #4CAF50;
        clip-path: polygon(100% 0%, 0% 0%, 0% 70%, 100% 100%);
      "></div>

      <!-- Bottom Right Decorative Corner -->
      <div style="
        position: absolute;
        right: 0;
        bottom: 0;
        width: 80px;
        height: 80px;
        background-color: #4CAF50;
        clip-path: polygon(100% 0%, 100% 100%, 0% 100%);
      "></div>

      <!-- Main Content Area -->
      <div style="padding: 20mm 20mm 20mm 25mm; position: relative; z-index: 1;">
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 12px;">
          <img
            src="/src/assets/sanroquelogo.jpg"
            alt="Barangay Logo"
            style="width: 65px; height: 65px; margin-bottom: 5px;"
          />
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Republic of the Philippines</div>
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Province of Rizal</div>
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Municipality of Rodriguez</div>
          <div style="font-size: 15px; font-weight: bold; margin-top: 5px;">BARANGAY SAN ROQUE</div>
          <div style="font-size: 10px; margin-top: 2px; font-weight: bold;">OFFICE OF THE PUNONG BARANGAY</div>
        </div>

        <!-- Certificate Title in Box -->
        <div style="
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          text-transform: uppercase;
          margin: 18px 40px;
          padding: 12px 15px;
          border: 2px solid #333;
          background-color: #f5f5f5;
        ">
          CERTIFICATE OF LOW INCOME
        </div>

        <!-- Certificate Content -->
        <div style="font-size: 13px; line-height: 1.6; text-align: justify; margin: 18px 0;">
          <div style="text-align: left; margin-bottom: 12px;">
            <strong>To whom it may concern:</strong>
          </div>

          <p style="text-indent: 35px; margin-bottom: 12px;">
            This is to certify that <strong>${data.full_name}</strong>, of legal age, Filipino citizen, and a resident of <strong>${data.address}</strong>, Barangay San Roque, Rodriguez, Rizal, Philippines, belongs to an indigent family.
          </p>

          <p style="text-indent: 35px; margin-bottom: 12px;">
            Based on the records available in this Barangay, the above-named person is considered as belonging to the low-income sector of our community and requires assistance programs and social welfare benefits.
          </p>

          <p style="text-indent: 35px; margin-bottom: 18px;">
            Issued this <strong>${new Date().getDate()}</strong> day of <strong>${new Date().toLocaleDateString('en-US', { month: 'long' })}</strong>, <strong>${new Date().getFullYear()}</strong> at Barangay San Roque, Rodriguez, Rizal upon the request of the above-named person for <strong>${data.purpose}</strong>.
          </p>
        </div>

        <!-- Signatures Section -->
        <div style="margin-top: 35px;">
          <div style="text-align: right; margin-bottom: 12px;">
            <strong>Certified/Attested by:</strong>
          </div>
          <div style="text-align: right; margin-bottom: 35px;">
            <div style="border-bottom: 1px solid black; width: 160px; margin-left: auto; margin-bottom: 2px;"></div>
            <div style="font-size: 12px; font-weight: bold;">PUNONG BARANGAY</div>
            <div style="font-size: 11px;">Barangay San Roque</div>
          </div>

          <div style="text-align: right;">
            <strong>With the authority of the Punong Barangay:</strong>
          </div>
          <div style="text-align: right;">
            <div style="border-bottom: 1px solid black; width: 160px; margin-left: auto; margin-bottom: 2px; margin-top: 28px;"></div>
            <div style="font-size: 12px; font-weight: bold;">BARANGAY SECRETARY</div>
          </div>
        </div>
      </div>

      <!-- Footer Notes -->
      <div style="
        position: absolute;
        bottom: 12mm;
        left: 25mm;
        right: 25mm;
        font-size: 9px;
        text-align: center;
        line-height: 1.3;
      ">
        <div style="color: #666; margin-bottom: 3px;">Note: This certification is not valid if it is containing erasures and alterations.</div>
        <div style="color: #d32f2f; font-weight: bold;">Not valid without the Barangay seal.</div>
      </div>
    </div>
  `;
};

export const CertificateOfIndigencyType1 = (data: CertificateData): string => {
  return `
    <div style="
      font-family: 'Times New Roman', serif;
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
      padding: 0;
      background-color: white;
      position: relative;
      box-sizing: border-box;
      overflow: hidden;
    ">
      <!-- Left Decorative Border -->
      <div style="
        position: absolute;
        left: 0;
        top: 0;
        width: 20px;
        height: 150px;
        background-color: #4CAF50;
        clip-path: polygon(100% 0%, 0% 0%, 0% 70%, 100% 100%);
      "></div>

      <!-- Bottom Right Decorative Corner -->
      <div style="
        position: absolute;
        right: 0;
        bottom: 0;
        width: 80px;
        height: 80px;
        background-color: #4CAF50;
        clip-path: polygon(100% 0%, 100% 100%, 0% 100%);
      "></div>

      <!-- Main Content Area -->
      <div style="padding: 20mm 20mm 20mm 25mm; position: relative; z-index: 1;">
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 12px;">
          <img
            src="/src/assets/sanroquelogo.jpg"
            alt="Barangay Logo"
            style="width: 65px; height: 65px; margin-bottom: 5px;"
          />
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Republic of the Philippines</div>
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Province of Rizal</div>
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Municipality of Rodriguez</div>
          <div style="font-size: 15px; font-weight: bold; margin-top: 5px;">BARANGAY SAN ROQUE</div>
          <div style="font-size: 10px; margin-top: 2px; font-weight: bold;">OFFICE OF THE PUNONG BARANGAY</div>
        </div>

        <!-- Certificate Title in Box -->
        <div style="
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          text-transform: uppercase;
          margin: 18px 40px;
          padding: 12px 15px;
          border: 2px solid #333;
          background-color: #f5f5f5;
        ">
          CERTIFICATE OF INDIGENCY
        </div>

        <!-- Certificate Content -->
        <div style="font-size: 13px; line-height: 1.6; text-align: justify; margin: 18px 0;">
          <div style="text-align: left; margin-bottom: 12px;">
            <strong>To whom it may concern:</strong>
          </div>

          <p style="text-indent: 35px; margin-bottom: 12px;">
            This is to certify that <strong>${data.full_name}</strong>, of legal age, Filipino citizen, and a resident of <strong>${data.address}</strong>, Barangay San Roque, Rodriguez, Rizal, Philippines, belongs to an indigent family in this Barangay.
          </p>

          <p style="text-indent: 35px; margin-bottom: 12px;">
            Based on the records available in this Barangay, the above-named person is considered as belonging to the indigent sector of our community and is qualified for assistance programs and benefits.
          </p>

          <p style="text-indent: 35px; margin-bottom: 18px;">
            Issued this <strong>${new Date().getDate()}</strong> day of <strong>${new Date().toLocaleDateString('en-US', { month: 'long' })}</strong>, <strong>${new Date().getFullYear()}</strong> at Barangay San Roque, Rodriguez, Rizal upon the request of the above-named person for <strong>${data.purpose}</strong>.
          </p>
        </div>

        <!-- Signatures Section -->
        <div style="margin-top: 35px;">
          <div style="text-align: right; margin-bottom: 12px;">
            <strong>Certified/Attested by:</strong>
          </div>
          <div style="text-align: right; margin-bottom: 35px;">
            <div style="border-bottom: 1px solid black; width: 160px; margin-left: auto; margin-bottom: 2px;"></div>
            <div style="font-size: 12px; font-weight: bold;">PUNONG BARANGAY</div>
            <div style="font-size: 11px;">Barangay San Roque</div>
          </div>

          <div style="text-align: right;">
            <strong>With the authority of the Punong Barangay:</strong>
          </div>
          <div style="text-align: right;">
            <div style="border-bottom: 1px solid black; width: 160px; margin-left: auto; margin-bottom: 2px; margin-top: 28px;"></div>
            <div style="font-size: 12px; font-weight: bold;">BARANGAY SECRETARY</div>
          </div>
        </div>
      </div>

      <!-- Footer Notes -->
      <div style="
        position: absolute;
        bottom: 12mm;
        left: 25mm;
        right: 25mm;
        font-size: 9px;
        text-align: center;
        line-height: 1.3;
      ">
        <div style="color: #666; margin-bottom: 3px;">Note: This certification is not valid if it is containing erasures and alterations.</div>
        <div style="color: #d32f2f; font-weight: bold;">Not valid without the Barangay seal.</div>
      </div>
    </div>
  `;
};

export const CertificateOfIndigencyType2 = (data: CertificateData): string => {
  return `
    <div style="
      font-family: 'Times New Roman', serif;
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
      padding: 0;
      background-color: white;
      position: relative;
      box-sizing: border-box;
      overflow: hidden;
    ">
      <!-- Left Decorative Border -->
      <div style="
        position: absolute;
        left: 0;
        top: 0;
        width: 20px;
        height: 150px;
        background-color: #4CAF50;
        clip-path: polygon(100% 0%, 0% 0%, 0% 70%, 100% 100%);
      "></div>

      <!-- Bottom Right Decorative Corner -->
      <div style="
        position: absolute;
        right: 0;
        bottom: 0;
        width: 80px;
        height: 80px;
        background-color: #4CAF50;
        clip-path: polygon(100% 0%, 100% 100%, 0% 100%);
      "></div>

      <!-- Main Content Area -->
      <div style="padding: 20mm 20mm 20mm 25mm; position: relative; z-index: 1;">
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 12px;">
          <img
            src="/src/assets/sanroquelogo.jpg"
            alt="Barangay Logo"
            style="width: 65px; height: 65px; margin-bottom: 5px;"
          />
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Republic of the Philippines</div>
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Province of Rizal</div>
          <div style="font-size: 11px; font-weight: bold; line-height: 1.1;">Municipality of Rodriguez</div>
          <div style="font-size: 15px; font-weight: bold; margin-top: 5px;">BARANGAY SAN ROQUE</div>
          <div style="font-size: 10px; margin-top: 2px; font-weight: bold;">OFFICE OF THE PUNONG BARANGAY</div>
        </div>

        <!-- Certificate Title in Box -->
        <div style="
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          text-transform: uppercase;
          margin: 18px 40px;
          padding: 12px 15px;
          border: 2px solid #333;
          background-color: #f5f5f5;
        ">
          CERTIFICATE OF INDIGENCY
        </div>

        <!-- Certificate Content -->
        <div style="font-size: 13px; line-height: 1.6; text-align: justify; margin: 18px 0;">
          <div style="text-align: left; margin-bottom: 12px;">
            <strong>To whom it may concern:</strong>
          </div>

          <p style="text-indent: 35px; margin-bottom: 12px;">
            This is to certify that <strong>${data.full_name}</strong>, of legal age, Filipino citizen, and a resident of <strong>${data.address}</strong>, Barangay San Roque, Rodriguez, Rizal, Philippines, belongs to an indigent family in this Barangay.
          </p>

          <p style="text-indent: 35px; margin-bottom: 12px;">
            Based on the records available in this Barangay, the above-named person is considered as belonging to the indigent sector of our community and is qualified for medical assistance, burial assistance, and other social welfare programs.
          </p>

          <p style="text-indent: 35px; margin-bottom: 18px;">
            Issued this <strong>${new Date().getDate()}</strong> day of <strong>${new Date().toLocaleDateString('en-US', { month: 'long' })}</strong>, <strong>${new Date().getFullYear()}</strong> at Barangay San Roque, Rodriguez, Rizal upon the request of the above-named person for <strong>${data.purpose}</strong>.
          </p>
        </div>

        <!-- Signatures Section -->
        <div style="margin-top: 35px;">
          <div style="text-align: right; margin-bottom: 12px;">
            <strong>Certified/Attested by:</strong>
          </div>
          <div style="text-align: right; margin-bottom: 35px;">
            <div style="border-bottom: 1px solid black; width: 160px; margin-left: auto; margin-bottom: 2px;"></div>
            <div style="font-size: 12px; font-weight: bold;">PUNONG BARANGAY</div>
            <div style="font-size: 11px;">Barangay San Roque</div>
          </div>

          <div style="text-align: right;">
            <strong>With the authority of the Punong Barangay:</strong>
          </div>
          <div style="text-align: right;">
            <div style="border-bottom: 1px solid black; width: 160px; margin-left: auto; margin-bottom: 2px; margin-top: 28px;"></div>
            <div style="font-size: 12px; font-weight: bold;">BARANGAY SECRETARY</div>
          </div>
        </div>
      </div>

      <!-- Footer Notes -->
      <div style="
        position: absolute;
        bottom: 12mm;
        left: 25mm;
        right: 25mm;
        font-size: 9px;
        text-align: center;
        line-height: 1.3;
      ">
        <div style="color: #666; margin-bottom: 3px;">Note: This certification is not valid if it is containing erasures and alterations.</div>
        <div style="color: #d32f2f; font-weight: bold;">Not valid without the Barangay seal.</div>
      </div>
    </div>
  `;
};
