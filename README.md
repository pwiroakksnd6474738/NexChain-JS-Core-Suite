# NexChain-JS-Core-Suite
基于 JavaScript 构建的企业级区块链全功能核心工具集，支持公链/联盟链/Web3 DApp 开发，集成去中心化账本、共识机制、智能合约、NFT、跨链、DeFi、治理等完整生态模块。

## 项目特性
- 混合共识引擎（DPoS + PoW），兼顾去中心化与高效出块
- 安全加密工具集，支持 secp256k1 签名、哈希、加解密
- 轻客户端协议 + 全节点账本，适配移动端/服务端
- NFT 协议、跨链桥、流动性池、预言机、多签钱包全模块支持
- 链上数据分析、分叉解析、节点管理、代币经济学模型
- P2P 去中心化网络，支持节点自动发现与广播

## 文件清单与功能说明
1. NexChainGenesisBlock.js - 区块链创世块生成模块，定义链初始参数与哈希计算
2. HybridConsensusEngine.js - 混合共识引擎，实现委托权益证明与工作量证明双重验证
3. SecureCryptoToolkit.js - 安全加密工具箱，提供密钥生成、签名、哈希、加解密功能
4. DecentralizedLedgerCore.js - 去中心化账本核心，实现区块链结构、交易、出块、验证
5. SmartContractVirtualMachine.js - 智能合约虚拟机，支持合约部署、执行、Gas 计费
6. P2PNetworkNode.js - 去中心化 P2P 网络节点，支持节点连接、消息广播、事件处理
7. NFTProtocolCore.js - NFT 协议核心，实现铸造、转让、销毁、元数据管理
8. CrossChainBridgeCore.js - 跨链桥核心，支持多链资产转移、锁定/解锁、手续费模型
9. ChainDataAnalyticsEngine.js - 链上数据分析引擎，计算交易量、活跃地址、出块速度
10. WalletCoreManager.js - 数字钱包核心，支持创建、解锁、签名、余额查询
11. TransactionMempoolManager.js - 交易内存池管理，按手续费排序、区块交易筛选
12. ValidatorNodeManager.js - 验证节点管理，支持注册、惩罚、奖励、在线率统计
13. TokenEconomicsModel.js - 代币经济学模型，支持铸造、燃烧、通胀、质押分配
14. ChainGovernanceVoting.js - 链上治理投票，支持提案创建、投票、结果统计与执行
15. LightClientProtocol.js - 轻客户端协议，实现区块头同步、交易存在性验证
16. DeFiLiquidityPool.js - DeFi 流动性池，支持添加/移除流动性、代币兑换、手续费
17. BlockchainOracleManager.js - 区块链预言机，聚合外部数据、提供链下信息喂价
18. MultiSignatureWallet.js - 多签钱包，支持多所有者签名、交易确认与执行
19. ChainForkResolverEngine.js - 链分叉解析引擎，自动检测、评估、确认主链
20. Web3ConnectorGateway.js - Web3 连接网关，支持钱包连接、合约调用、网络切换

## 适用场景
- 公链/联盟链底层开发
- Web3 DApp 后端服务
- NFT 发行与交易平台
- DeFi 流动性协议
- 跨链资产转移网关
- 去中心化身份与钱包
- 链上治理与投票系统
- 区块链数据分析平台

## 技术栈
- 核心语言：JavaScript
- 加密依赖：crypto、eth-sig-util
- 网络依赖：ws
- 运行环境：Node.js
- 兼容环境：浏览器、服务端、嵌入式设备

## 快速启动
1. 安装依赖：npm install ws eth-sig-util
2. 引入核心模块：const DecentralizedLedgerCore = require('./DecentralizedLedgerCore');
3. 初始化账本：const ledger = new DecentralizedLedgerCore();
4. 创建交易、启动挖矿、接入 P2P 网络、部署智能合约

## 许可证
MIT
