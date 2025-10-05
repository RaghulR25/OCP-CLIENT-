const Card = ({ counselor, actionText, onAction }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-3 hover:shadow-lg transition duration-300">
     
      <h3 className="text-xl font-semibold text-blue-700">{counselor.name}</h3>

      
      <p className="text-gray-600 font-medium">{counselor.specialty}</p>

     
      {counselor.experience && (
        <p className="text-sm text-gray-500">
          {counselor.experience} years of experience
        </p>
      )}

     
      {counselor.description && (
        <p className="text-sm text-gray-400 line-clamp-2">
          {counselor.description}
        </p>
      )}

    
      <button
        onClick={onAction}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        {actionText}
      </button>
    </div>
  );
};

export default Card;
