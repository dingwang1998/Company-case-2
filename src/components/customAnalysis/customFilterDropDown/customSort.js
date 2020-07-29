import { Radio } from 'antd';
import styles from './customSort.less';
export default  (props) => {
  const { onChangeSort, sort, col } = props;
  let curValue = 'NOSORT';
  if(sort.sortBy === col.dataIndex) {
    curValue = sort.sortDirection;
  }
  return (
    <div className={styles.sortWrap}>
      <p className={styles.tit}>排序</p>
      <Radio.Group onChange={ onChangeSort } value={curValue}>
        <Radio.Button value="ASC">升序</Radio.Button>
        <Radio.Button value="DESC" style={{marginRight: '12px',marginLeft: '12px'}}>降序</Radio.Button>
        <Radio.Button value="NOSORT">不排序</Radio.Button>
      </Radio.Group>
    </div>
  );
};