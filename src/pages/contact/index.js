import Layout from "../../components/layout";

const Contact = () => {
  return (
    <Layout>
      <div className="pt-28 md:pt-24 px-8 md:px-5 pb-16">
        <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-gray-500">Support</p>
          <h1 className="text-3xl md:text-2xl font-bold text-theme mt-2">Contact CurrentTech</h1>
          <p className="mt-4 text-lg md:text-base">
            For app support, privacy questions, subscription issues, project questions, or feedback,
            email{" "}
            <a href="mailto:currenttech.co.za@gmail.com" className="text-blue-600 underline">
              currenttech.co.za@gmail.com
            </a>.
          </p>
          <p className="mt-4 text-gray-600">
            Include the app name, device model, iOS version, and a short description of the issue so
            support can respond with the right context.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
