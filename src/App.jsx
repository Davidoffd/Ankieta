import { useEffect, useState } from "react";
import { supabase } from "./supabase";
function App() {
  const [email, setEmail] = useState("");
  const [allowed, setAllowed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [voted, setVoted] = useState(false);
  const [yesVotes, setYesVotes] = useState(0);
  const [noVotes, setNoVotes] = useState(0);

  useEffect(() => {
    loadVotes();
  }, []);
  const loadVotes = async () => {
    const { data } = await supabase
      .from("votes")
      .select("answer");

    if (!data) return;

    const yes = data.filter(
      (v) => v.answer === "TAK"
    ).length;

    const no = data.filter(
      (v) => v.answer === "NIE"
    ).length;

    setYesVotes(yes);
    setNoVotes(no);
  };

  const login = async () => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    setChecked(true);

    if (!data) {
      setAllowed(false);
      return;
    }

    if (data.voted) {
      setVoted(true);
    }

    setAllowed(true);
  };
const vote = async (answer) => {
  await supabase
    .from("votes")
    .insert([
      {
        email,
        answer,
      },
    ]);

  await supabase
    .from("users")
    .update({ voted: true })
    .eq("email", email);

  setVoted(true);

  loadVotes();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl p-8 text-center">

        <h1 className="text-4xl font-bold mb-8">
          Ankieta
        </h1>

        {!allowed && !voted && (
          <div className="space-y-4">

            <input
              type="email"
              placeholder="Twój email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full p-4 border rounded-2xl"
            />

            <button
              onClick={login}
              className="w-full bg-blue-600 text-white p-4 rounded-2xl text-xl"
            >
              Zaloguj
            </button>

            {checked && !allowed && (
              <p className="text-red-600 font-bold">
                Brak dostępu
              </p>
            )}
          </div>
        )}
        {allowed && !voted && (
          <div>
            <p className="text-2xl mb-8">
              Czy podoba Ci się nowa aplikacja?
            </p>

            <div className="flex gap-4">

              <button
                onClick={() => vote("TAK")}
                className="flex-1 bg-green-600 text-white p-4 rounded-2xl text-2xl"
              >
                TAK
              </button>

              <button
                onClick={() => vote("NIE")}
                className="flex-1 bg-red-600 text-white p-4 rounded-2xl text-2xl"
              >
                NIE
              </button>
            </div>
          </div>
        )}

        {voted && (
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Dziękujemy za głos 😄
            </h2>

            <div className="space-y-4 text-xl">

              <div className="bg-green-100 p-4 rounded-2xl">
                TAK: {yesVotes}
              </div>

              <div className="bg-red-100 p-4 rounded-2xl">
                NIE: {noVotes}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;