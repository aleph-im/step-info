const overlay = {
    "11111111111111111111111111111111": {
        "address": "11111111111111111111111111111111",
        "name": "Native Solana",
        "decimals": 9,
        "symbol": "SOL",
        "logoURI": "https://ipfs.io/ipfs/Qmf1ChZ6kfVuhQUXusSrSBoppkTYeisAXXdDFR15LAyBDw"
    },
    "CsZ5LZkDS7h9TDKjrbL7VAwQZ9nsRu8vJLhRYfmGaN8K": {
        "address": "CsZ5LZkDS7h9TDKjrbL7VAwQZ9nsRu8vJLhRYfmGaN8K",
        "name": "Wrapped ALEPH (Sollet)",
        "decimals": 6,
        "symbol": "ALEPH",
        "logoURI": "https://ipfs.io/ipfs/QmQxzDZzQJJ4Jb1npvLYbXZjHDCyqywHWBADcJbGWJGEqW/Aleph.im%20-%20Token/Aleph.im-Token-v1.1.png"
    },
    "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs": {
        "address": "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
        "name": "Wrapped ETH (Wormhole)",
        "decimals": 8,
        "symbol": "whETH",
        "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk/logo.png"
    }
}

export function get_token(address, def) {
    if (overlay[address] !== undefined)
        return overlay[address]
    else
        return def
}