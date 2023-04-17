import '../../assets/css/index.css'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card, Layout, Segmented, Select, Space } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import {
  ScoreRankingRequest,
  ScoreRankingResponse,
} from '../../data/database/Report'
import { useAppDispatch, useAppSelector } from '../../redux/app/hook'
import { fetchScoreRanking } from '../../redux/features/report/scoreRankingSlice'
import Icon from '@ant-design/icons'
import { ReactComponent as Gold } from '../../assets/img/bling-gold.svg'
import { ReactComponent as Silver } from '../../assets/img/bling-silver.svg'
import { ReactComponent as Bronze } from '../../assets/img/bling-bronze.svg'

const { Content } = Layout

interface DataType {
  key: string
  rank: React.ReactNode
  name: React.ReactNode
  department: React.ReactNode
  score: React.ReactNode
}

interface ScoreRankingInput {
  reloadCount: number
  defaultDep: string
}

interface ScoreRankingMedal {
  index: number
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    align: 'center',
    width: '10%',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: '50%',
  },
  {
    title: 'Department',
    dataIndex: 'department',
    align: 'center',
    width: '20%',
  },
  {
    title: 'Score',
    dataIndex: 'score',
    align: 'center',
    width: '20%',
  },
]
const MedalIcon: React.FC<ScoreRankingMedal> = ({ index }) => {
  if (index === 1) {
    return <Icon component={Gold} style={{ fontSize: '20px' }} />
  } else if (index === 2) {
    return <Icon component={Silver} style={{ fontSize: '20px' }} />
  } else if (index === 3) {
    return <Icon component={Bronze} style={{ fontSize: '20px' }} />
  } else {
    return <p>{index}</p>
  }
}

const ScoreRanking: React.FC<ScoreRankingInput> = ({
  reloadCount,
  defaultDep,
}) => {
  const [value, setValue] = useState<string | number>('This month')
  const [scoreRankingReq, setScoreRankingReq] = useState<ScoreRankingRequest>({
    department: defaultDep,
    baseOnMonth: 1,
  })
  const [tableData, setTableData] = useState<DataType[]>([])
  const [options, setOptions] = useState<any[]>([])
  const [reload, setReload] = useState(reloadCount)
  const score = useAppSelector((state) => state.scoreRanking)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setReload(reload + 1)
  }, [])

  useEffect(() => {
    dispatch(fetchScoreRanking(scoreRankingReq))
  }, [reload, reloadCount])

  useEffect(() => {
    if (!score.loading && score.score.length !== undefined) {
      MappingTableData(score.score)
    }
  }, [score.loading, score.score.length])

  const MappingTableData = (scoreResponse: ScoreRankingResponse[]) => {
    let data: DataType[] = []
    for (let index = 0; index < scoreResponse.length; index++) {
      const element = scoreResponse[index]
      data.push({
        rank: <MedalIcon index={index + 1} />,
        name: <p>{element.LastName + ' ' + element.FirstName}</p>,
        department: <p>{element.Department}</p>,
        score: <p>{element.TotalScore}</p>,
        key: element._id! + ' ' + element.TotalScore,
      })
    }
    setTableData(data)

    if (defaultDep.toLowerCase() === 'All'.toLowerCase()) {
      setOptions([
        {
          value: 'All',
          label: 'All',
        },
        {
          value: 'BA',
          label: 'BA',
        },
        {
          value: 'DA',
          label: 'DA',
        },
        {
          value: 'DE',
          label: 'DE',
        },
        {
          value: 'DT',
          label: 'DT',
        },

        {
          value: 'R&D',
          label: 'R&D',
        },
        {
          value: 'PD',
          label: 'PD',
        },
        {
          value: 'PMO',
          label: 'PMO',
        },
        {
          value: 'SALES_HN',
          label: 'SALES_HN',
        },
        {
          value: 'SALES_HCM',
          label: 'SALES_HCM',
        },
      ])
    } else {
      setOptions([
        {
          value: defaultDep,
          label: defaultDep,
        },
      ])
    }
  }

  const OnChangeFilter = (e: string) => {
    setValue(e)
    if (e === 'This week') {
      setScoreRankingReq({
        ...scoreRankingReq,
        baseOnWeek: 1,
        baseOnMonth: 0,
        baseOnYear: 0,
      })
    } else if (e === 'This month') {
      setScoreRankingReq({
        ...scoreRankingReq,
        baseOnMonth: 1,
        baseOnWeek: 0,
        baseOnYear: 0,
      })
    } else {
      setScoreRankingReq({
        ...scoreRankingReq,
        baseOnMonth: 0,
        baseOnWeek: 0,
        baseOnYear: 1,
      })
    }
    setReload(reload + 1)
  }

  const OnSelectFilter = (e: string) => {
    setScoreRankingReq({ ...scoreRankingReq, department: e })
    setReload(reload + 2)
  }

  return (
    <Card
      title="Score ranking"
      style={{ width: '100%' }}
      headStyle={{ backgroundColor: '#eeeeee' }}
      extra={
        <>
          <FontAwesomeIcon
            icon={faRefresh}
            size="lg"
            style={{ marginRight: '10px', cursor: 'pointer' }}
            onClick={() => setReload(reload + 1)}
          />
          {/* <FontAwesomeIcon icon={faExpand} size={'lg'} /> */}
        </>
      }
      onResize={(e) => console.log(e)}
    >
      <div style={{ marginBottom: '10px' }}>
        <Select
          showSearch
          style={{ width: 200 }}
          defaultValue={defaultDep}
          onSelect={(e) => OnSelectFilter(e)}
          placeholder="Seach to select"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? '')
              .toString()
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '')
              .toLowerCase()
              .localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={options}
        />
        <Space direction="horizontal" align="center" style={{ float: 'right' }}>
          <Segmented
            style={{ backgroundColor: '#9CA3AF' }}
            // style={{ background: '#9CA3AF ' }}
            color="red"
            options={['This week', 'This month', 'This year']}
            value={value}
            onChange={(e) => {
              OnChangeFilter(e.toString())
            }}
          />
          {/*  <ExportMenu /> */}
        </Space>
      </div>
      <Table
        rowClassName={(record, index) => {
          return 'custom-table-row'
        }}
        pagination={{
          defaultCurrent: 1,
          defaultPageSize: 5,
          pageSizeOptions: ['5', '10', '15', '20'],
        }}
        columns={columns}
        dataSource={tableData}
        size="small"
      />
    </Card>
  )
}

export default ScoreRanking
