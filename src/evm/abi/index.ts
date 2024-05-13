
export const SIGNING_ABI_ETHERS = [
    'function dataTaskSign(uint256 i) view returns (uint256 blocknumber, address wallet, string comment)',
    'function dataGameSign(uint256 i) view returns (uint256 blocknumber, address wallet, string comment)',
    'function dataGameRecharge(uint256 i) view returns (uint256 blocknumber, address wallet, uint256 amount, string comment)',
    'function queryIndex() view returns (uint tasksignindex, uint gamesignindex, uint gamerechargeindex)',
    "function taskSign(string memory comment) external",
    "function gameSign(string memory comment) external",
    "function gameRecharge(string memory comment) external payable",
    "event OnTaskSign(uint256 index, uint256 timestamp, address wallet, string comment)",
    "event OnGameSign(uint256 index, uint256 timestamp, address wallet, string comment)",
    "event OnGameRecharge( uint256 index, uint256 timestamp, address wallet, uint amount, string comment )",
    "function gameRechargeERC20( uint256 tokenid, uint256 amount, string memory comment) external",
    "event OnGameRechargeERC20( uint256 index, uint256 timestamp, uint256 tokenid, address wallet, uint amount, string comment)"
];