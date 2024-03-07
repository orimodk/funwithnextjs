import RandomProducts from '../components/RandomProducts'

export default async function Page() {
    return (
        <div>
            <RandomProducts nrOfProducts={5} prodName={undefined}></RandomProducts>
        </div>
    );
}