import React, { useId } from "react";
import { CollectionService, ControlTypes, ICollectionRow, IRowDataSource, RootState, useDataSource } from "@harpreet547/cdh";
import { makeStyles, shorthands } from "@fluentui/react-components";
import { getLabelClassName } from "../HelperFunctions";
import ControlLabel from "../ControlLabel/ControlLabel";
import { tokens } from '../../Theme/Theme';
import { useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";
import MessageBar from "../MessageBar/MessageBar";
import { MessageBarType } from "../MessageBar/Types";

interface IListControlProps extends ControlTypes.ILocalizedLabel {
    datasource?: IRowDataSource;
    rows?: Record<string, unknown>[];
    keyExtractor: (row: Record<string, unknown> | ICollectionRow) => string | number;
    onRenderListItem: (row: Record<string, unknown> | ICollectionRow, index: number) => React.ReactElement;
    id?: string;
}
const ListControl: React.FC<IListControlProps> = (props: IListControlProps): React.ReactElement => {
    const { keyExtractor, datasource, rows, onRenderListItem, label, labelLocalizedID, id } = props;

    const autoGeneratedID = useId();

    const finalID = id ?? autoGeneratedID + '-dropdown';

    const styles = useStyles();

    const isLoading = useSelector((state: RootState) => {
        return datasource ? CollectionService.get(datasource.collectionID, state)?.loadState === 'Loading' : null;
    });

    const listDataSourceError = useSelector((state: RootState) => {
        return datasource ? CollectionService.get(datasource.collectionID, state)?.error?.message : null;
    });

    const datasourceRows = useDataSource('RowDataSource', datasource) as ICollectionRow[] | undefined | null;

    const finalRows = datasourceRows ?? rows;

    return (
        <div className={`cruds-controls-root ${getLabelClassName('Top')}`}>
            <ControlLabel
                htmlFor={finalID}
                label={label}
                labelLocalizedID={labelLocalizedID}
            />
            {
                isLoading ? (
                    <Spinner
                        label={`Loading...`}
                    />
                ) : (
                    listDataSourceError ? (
                        <MessageBar
                            message={listDataSourceError}
                            type={MessageBarType.error}
                        />
                    ) :
                        <ul
                            className={styles.ul}
                        >
                            {
                                finalRows?.map((row, index) => (
                                    <li
                                        key={keyExtractor(row)}
                                        className={styles.li}
                                    >
                                        {
                                            onRenderListItem(row, index)
                                        }
                                    </li>
                                ))
                            }
                        </ul>
                )
            }
        </div>
    );
};
export default ListControl;

const useStyles = makeStyles({
    ul: {
        ...shorthands.padding(0),
    },
    li: {
        listStyleType: 'none',
        marginBottom: tokens.spacingHorizontalM,
    }
});