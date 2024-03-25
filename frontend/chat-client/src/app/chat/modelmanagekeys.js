import React, { useState, useEffect } from 'react';

const KeyChangeModal = ({ isOpen, onClose }) => {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  useEffect(() => {
    // Retrieve keys from local storage when component mounts
    const storedPublicKey = localStorage.getItem('public_key');
    const storedPrivateKey = localStorage.getItem('private_key');
    if (storedPublicKey) {
      setPublicKey(storedPublicKey);
    }
    if (storedPrivateKey) {
      setPrivateKey(storedPrivateKey);
    }
  }, []);

  const handleSaveKeys = () => {
    // Save keys to local storage
    localStorage.setItem('public_key', publicKey);
    localStorage.setItem('private_key', privateKey);
    onClose();
    window.location.reload(); // Reload the page
  };

  return (
    <div className={`fixed z-10 inset-0 overflow-y-auto ${isOpen ? '' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h1 className="text-lg font-semibold mb-4">Change Keys</h1>
            <div className="mb-4">
              <label htmlFor="public-key" className="block text-sm font-medium text-gray-700">Public Key</label>
              <textarea
                id="public-key"
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter public key"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="private-key" className="block text-sm font-medium text-gray-700">Private Key</label>
              <textarea
                id="private-key"
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter private key"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
              />
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleSaveKeys}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              Save
            </button>
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyChangeModal;
