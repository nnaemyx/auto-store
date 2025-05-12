import React from 'react';

const VehicleMaintenance = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-6 text-center">Vehicle Maintenance Guide</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">The Importance of Routine Vehicle Maintenance</h2>
            <p className="text-gray-700">
              Your vehicle is one of your most valuable assets—both financially and in terms of convenience. Yet, many car owners overlook the importance of regular maintenance until a major problem arises. Whether you&apos;re driving a brand-new vehicle or an aging truck, routine vehicle maintenance is essential to keeping your ride safe, reliable, and efficient.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Key Benefits of Regular Maintenance</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">1. Enhances Safety</h3>
                <p className="text-gray-700">
                  One of the most important reasons for regular maintenance is safety. Worn-out brakes, bald tires, low fluid levels, and engine issues can all lead to dangerous driving situations. Routine checks ensure that your vehicle is in top condition, reducing the risk of accidents due to mechanical failure.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">2. Saves You Money in the Long Run</h3>
                <p className="text-gray-700">
                  Skipping routine maintenance might save money now—but it can cost you a lot more later. For example, not changing your oil can lead to engine failure. Ignoring brake pad wear can damage the rotors. These are costly repairs that could have been avoided with preventive care.
                </p>
                <p className="text-gray-700 mt-2">
                  Replacing parts on schedule (like belts, filters, and fluids) costs far less than repairing the damage caused by their failure.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">3. Improves Fuel Efficiency</h3>
                <p className="text-gray-700">
                  A well-maintained car runs more efficiently. Clean air filters, properly inflated tires, and timely oil changes all contribute to better fuel economy. That means fewer stops at the pump—and more money in your pocket.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">4. Extends Vehicle Lifespan</h3>
                <p className="text-gray-700">
                  Just like regular exercise keeps your body healthy, maintenance keeps your vehicle running longer. Routine care reduces wear and tear, keeps components working together smoothly, and prevents small issues from becoming big problems.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">5. Maintains Resale Value</h3>
                <p className="text-gray-700">
                  Thinking of selling or trading in your car someday? Vehicles with documented maintenance histories tend to sell faster and at higher prices. Buyers are more confident in vehicles that have been well cared for.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Common Routine Maintenance Tasks</h2>
            <p className="text-gray-700 mb-4">Here are a few key services to keep on your calendar:</p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Oil & Filter Changes (every 3,000–7,500 miles)</li>
              <li>Tire Rotation & Balancing</li>
              <li>Brake Inspection & Pad Replacement</li>
              <li>Battery Check & Replacement</li>
              <li>Air Filter & Cabin Filter Replacement</li>
              <li>Coolant, Transmission, and Brake Fluid Flushes</li>
              <li>Spark Plug Replacement</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Your owner&apos;s manual will provide specific intervals, or you can consult a trusted mechanic.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Need Replacement Parts?</h2>
            <p className="text-gray-700">
              Our store offers a wide range of quality auto parts—from oil filters to brake pads—all backed by expert support. Shop by vehicle make and model to ensure the perfect fit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Bottom Line</h2>
            <p className="text-gray-700">
              Routine vehicle maintenance is an investment—not an expense. It saves money, improves safety, and keeps your vehicle running like new.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default VehicleMaintenance; 