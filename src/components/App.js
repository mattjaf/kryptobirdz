import React, { Component, component } from "react";
import Web3 from "web3";
import detectEtherumProvider from "@metamask/detect-provider";
import KryptoBird from "../abis/KryptoBird.json"
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';
import './App.css';


class App extends Component {

    async componentDidMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
    }

    // first up is to detect ethereum provider
    async loadWeb3() {
        const provider = await detectEtherumProvider();

        // modern browsers
        // if tgere is a provider then lets
        // lets log that its working from the doc
        // to set Web3 to the provider

        if (provider) {
            console.log('ethereum, wallet is connected')
            window.web3 = new Web3(provider)
        } else {
            // no ethereum provider
            console.log('no ethereum wallet detected')
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        console.log(this.state.account)

        // create a constant js variable networkId which is set to the blockchain nettowrkId
        const networkId = await web3.eth.net.getId()
        const networkData = KryptoBird.networks[networkId]
        if (networkData) {
            const abi = KryptoBird.abi;
            const address = networkData.address;
            const contract = new web3.eth.Contract(abi, address)
            this.setState({ contract })
            console.log(this.state.contract);

            // call the total supply of our NFTs
            //grab the total supply on the front end and log the results
            // go to web3 doc and read up on methods and call
            const totalSupply = await contract.methods.totalSupply().call()
            this.setState({ totalSupply })
            console.log(this.state.totalSupply)
            //set up an array to keep track of tokens
            for (let i = 1; i <= totalSupply; i++) {
                const KryptoBird = await contract.methods.kryptoBirdz(i - 1).call()
                // how should we handle the state on the front end
                this.setState({
                    kryptoBirdz: [...this.state.kryptoBirdz, KryptoBird] // spread operator
                })

            }
            console.log(this.state.kryptoBirdz)
        } else {
            window.alert('Smart contract not deployed')
        }
    }

    // with minting we are sending infromation and we need to specify the account

    mint = (kryptoBird) => {
        this.state.contract.methods.mint(kryptoBird).send({ from: this.state.account })
            .once('receipt', (receipt) => {
                this.setState({
                    kryptoBirdz: [...this.state.kryptoBirdz, KryptoBird]
                })
            })
    }

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            contract: null,
            totalSupply: 0,
            kryptoBirdz: []
        }
    }

    render() {
        return (
            <div className="container-filled">
                {console.log(this.state.kryptoBirdz)}
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowwrap p-0 shadow">
                    <div className="nav-brand col-sm-3 col-md-3 mr-0" style={{ color: 'black' }}>

                        Krypto Birdz NFTs (non Fungible Tokens)
                    </div>
                    <ul className="navbar-nav px-3">
                        <li className='nav-item text-nowrap
                    d-none d-sm-none d-sm-block
                    '>
                            <small className="text-white">
                                {this.state.account}
                            </small>
                        </li>
                    </ul>
                </nav>

                <div className='container-fluid mt-1'>
                    <div className="row">
                        <main role='main'
                            className="col-lg-12 d-flex text-center">
                            <div className='content mr-auto ml-auto'
                                style={{ opacity: '0.8' }}>
                                <h1 style={{ color: 'white' }}>
                                    KryptoBirdz - NFT Marketplace</h1>
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const kryptoBird = this.kryptoBird.value
                                    this.mint(kryptoBird)
                                }}>
                                    <input
                                        type='text'
                                        placeholder='Add a file location'
                                        className='form-control mb-1'
                                        ref={(input) => this.kryptoBird = input}
                                    />
                                    <input style={{ margin: '6px' }}
                                        type='submit'
                                        className='btn btn-primary btn-black'
                                        value='MINT'
                                    />
                                </form>
                            </div>
                        </main>
                    </div>
                    <hr></hr>
                    <div className="row textCenter">
                        {this.state.kryptoBirdz.map((kryptoBird, key) => {
                            return (
                                <div>
                                    <div>
                                        <MDBCard className="token img" style={{ maxWidth: '22rem' }}>
                                            <MDBCardImage src={kryptoBird} position='top' height='250rem' style={{ marginRight: '4px' }} />
                                            <MDBCardBody>
                                                <MDBCardTitle> KryptoBirdz</MDBCardTitle>
                                                <MDBCardText> The KryptoBirdz are 20 uniquely generated from the cyber punk cloud galaxy  Mystopia!</MDBCardText>
                                                <MDBBtn href={kryptoBird}>Download</MDBBtn>
                                            </MDBCardBody>
                                        </MDBCard>
                                    </div>
                                </div>

                            )

                        })}

                    </div>
                </div>
            </div>
        )
    }
}

export default App;