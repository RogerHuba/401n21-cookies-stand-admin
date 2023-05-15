import Head from 'next/head';
import { useAuth } from '../contexts/auth';
import useResource from '../hooks/useResource';

const customBorder = "p-2 text-black border"

export default function Home() {

    const { user, login } = useAuth();

    return (
        <div className="p-4">
            <Head>
                <title>Cookie Stand Admin</title>
            </Head>
            <main className="p-4 space-y-8 text-center">
                <h1 className="text-4xl">Welcome to Patts Cookie Stands</h1>
                {user ?
                    <CookieStandAdmin />
                    :
                    <LoginForm onLogin={login} />
                }
            </main>

        </div>
    );
}

function CookieStandAdmin() {

    const { resources, deleteResource } = useResource();

    return (
        <>
            <CookieStandForm />
            <CookieStandTable stands={resources || []} deleteStand={deleteResource} />
        </>
    );
}

function CookieStandForm() {

    const { user } = useAuth();
    const { createResource } = useResource();

    function handleSubmit(event) {
        event.preventDefault();
        const info = {
            location: event.target.location.value,
            minimum_customers_per_hour: parseInt(event.target.minimum.value),
            maximum_customers_per_hour: parseInt(event.target.maximum.value),
            average_cookies_per_sale: parseFloat(event.target.average.value),
            owner: user.id,
        };
        event.target.reset();
        createResource(info);

    }

    return (
        <form onSubmit={handleSubmit}>
            <fieldset>
                <legend>Create Cookie Stand</legend>
                <input className="border-2 border-black" placeholder='location' name='location' />
                <input className="border-2 border-black" placeholder='minimum' name='minimum' />
                <input className="border-2 border-black" placeholder='maximum' name='maximum' />
                <input className="border-2 border-black" placeholder='average' name='average' />
                <button className="p-0.5 text-white bg-gray-500 rounded">create</button>
            </fieldset>
        </form>
    );
}

function CookieStandTable({ stands, deleteStand }) {

    return (
        <div className=" flex flex-col">
            <table className=" my-8">
                <thead>
                    <tr>
                        <th className={`${customBorder}`}>Location</th>
                        <th className={`${customBorder}`}>6 am</th>
                        <th className={`${customBorder}`}>7 am</th>
                        <th className={`${customBorder}`}>8 am</th>
                        <th className={`${customBorder}`}>9 am</th>
                        <th className={`${customBorder}`}>10 am</th>
                        <th className={`${customBorder}`}>11 am</th>
                        <th className={`${customBorder}`}>12 pm</th>
                        <th className={`${customBorder}`}>1 pm</th>
                        <th className={`${customBorder}`}>2 pm</th>
                        <th className={`${customBorder}`}>3 pm</th>
                        <th className={`${customBorder}`}>4 pm</th>
                        <th className={`${customBorder}`}>5 pm</th>
                        <th className={`${customBorder}`}>6 pm</th>
                        <th className={`${customBorder}`}>7 pm</th>
                        <th className={`${customBorder}`}>totals</th>
                    </tr>
                </thead>
                <tbody>
                    {stands.map(stand => (

                        <CookieStandRow key={stand.id} info={stand} deleteStand={deleteStand} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function CookieStandRow({ info, deleteStand }) {

    function clickHandler() {
        deleteStand(info.id);
    }

    if (info.hourly_sales.length == 0) {
        // bunk data
        info.hourly_sales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    return (
        <tr>
            <td className={`${customBorder} flex`}>{info.location} <button onClick={clickHandler}>[x]</button></td>
            {info.hourly_sales.map((slot, index) => <td className={`${customBorder}`} key={index}>{slot}</td>)}
            <td className={`${customBorder}`}>{info.hourly_sales.reduce((num, sum) => num + sum, 0)}</td>
        </tr>
    );
}


function LoginForm({ onLogin }) {

    async function handleSubmit(event) {
        event.preventDefault();
        onLogin(event.target.username.value, event.target.password.value);
    }

    return (
        <form onSubmit={handleSubmit}>
            <fieldset autoComplete='off'>
                <legend>Log In</legend>
                <label className="p-2 text-black " htmlFor="username">Username</label>
                <input className="p-2 text-black border" name="username" />
                <label className="p-2 text-black" htmlFor="password">Password</label>
                <input className="p-2 text-black border" type="password" name="password" />
                <button className="p-2 text-white bg-gray-500 rounded">Log In</button>
            </fieldset>
        </form>
    );
}
